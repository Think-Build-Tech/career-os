import { randomUUID } from "crypto";

export type AiRole = "system" | "user" | "assistant";

export interface AiMessage {
  role: AiRole;
  content: string;
}

export interface AiGenerationResult {
  requestId: string;
  provider: string;
  model: string;
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

export class AiGatewayError extends Error {
  constructor(
    message: string,
    readonly statusCode = 502,
    readonly code = "AI_GATEWAY_ERROR",
    readonly retryable = false
  ) {
    super(message);
    this.name = "AiGatewayError";
  }
}

interface GatewayResponse {
  request_id: string;
  provider: string;
  model: string;
  content: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  latency_ms?: number;
}

function asPositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

/**
 * Server-to-server client for the Python AI framework. The credential remains
 * on the API server and is never exposed to Angular or Expo clients.
 */
export class AiGatewayService {
  private readonly baseUrl = (process.env["AI_SERVICE_URL"] ?? "http://localhost:8000").replace(/\/$/, "");
  private readonly apiKey = process.env["AI_SERVICE_API_KEY"] ?? "";
  private readonly provider = process.env["AI_SERVICE_PROVIDER"] || undefined;
  private readonly model = process.env["AI_SERVICE_MODEL"] || undefined;
  private readonly timeoutMs = asPositiveInteger(process.env["AI_SERVICE_TIMEOUT_MS"], 120_000);

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async health(): Promise<{ configured: boolean; reachable: boolean; service?: unknown }> {
    if (!this.isConfigured()) return { configured: false, reachable: false };

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(Math.min(this.timeoutMs, 5_000)),
      });
      return {
        configured: true,
        reachable: response.ok,
        service: response.ok ? await response.json() : undefined,
      };
    } catch {
      return { configured: true, reachable: false };
    }
  }

  async generate(params: {
    signatureType: string;
    messages: AiMessage[];
    metadata?: Record<string, unknown>;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AiGenerationResult> {
    if (!this.apiKey) {
      throw new AiGatewayError(
        "TACIE AI is not configured. Set AI_SERVICE_API_KEY on the CareerOS API.",
        503,
        "AI_NOT_CONFIGURED"
      );
    }

    const requestId = randomUUID();
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/v1/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-Request-ID": requestId,
        },
        body: JSON.stringify({
          signature_type: params.signatureType,
          provider: this.provider,
          model: this.model,
          messages: params.messages,
          temperature: params.temperature ?? 0.2,
          max_tokens: params.maxTokens ?? 1_200,
          metadata: {
            application_id: "careeros-api",
            ...params.metadata,
          },
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI service request failed";
      throw new AiGatewayError(message, 503, "AI_SERVICE_UNREACHABLE", true);
    }

    const body = await response.json().catch(() => null) as GatewayResponse | { detail?: unknown } | null;
    if (!response.ok) {
      const detail = body && "detail" in body ? body.detail : undefined;
      const providerDetail = typeof detail === "object" && detail !== null
        ? detail as { code?: string; message?: string; retryable?: boolean }
        : undefined;
      throw new AiGatewayError(
        providerDetail?.message ?? "TACIE AI rejected the request",
        response.status >= 500 ? 503 : response.status,
        providerDetail?.code ?? "AI_PROVIDER_ERROR",
        providerDetail?.retryable ?? response.status >= 500
      );
    }

    const data = body as GatewayResponse;
    if (!data?.content || !data.request_id) {
      throw new AiGatewayError("TACIE AI returned an invalid response", 502, "AI_INVALID_RESPONSE");
    }

    return {
      requestId: data.request_id,
      provider: data.provider,
      model: data.model,
      content: data.content,
      usage: {
        inputTokens: data.usage?.input_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
        totalTokens: data.usage?.total_tokens ?? 0,
      },
      latencyMs: data.latency_ms ?? 0,
    };
  }

}

export function parseAiJson<T>(content: string): T {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? content).trim();
  try {
    return JSON.parse(candidate) as T;
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1)) as T;
      } catch {
        // Fall through to the stable API error below.
      }
    }
    throw new AiGatewayError("TACIE AI returned malformed structured output", 502, "AI_INVALID_JSON", true);
  }
}
