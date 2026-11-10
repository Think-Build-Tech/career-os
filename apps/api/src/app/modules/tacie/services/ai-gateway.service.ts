import { randomUUID } from "crypto";
import { AiUsageRecord } from "../models";

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

  private async persistUsage(record: {
    requestId: string;
    signatureType: string;
    provider: string;
    model: string;
    status: "SUCCESS" | "ERROR";
    latencyMs: number;
    metadata?: Record<string, unknown>;
    inputTokens?: number | null;
    outputTokens?: number | null;
    totalTokens?: number | null;
    errorCode?: string | null;
    errorMessage?: string | null;
  }): Promise<void> {
    const applicationId = record.metadata?.["application_id"];
    try {
      await AiUsageRecord.create({
        request_id: record.requestId,
        client_id: "careeros-api",
        application_id: typeof applicationId === "string" ? applicationId : null,
        signature_type: record.signatureType,
        provider: record.provider,
        model_name: record.model,
        status: record.status,
        input_tokens: record.inputTokens ?? null,
        output_tokens: record.outputTokens ?? null,
        total_tokens: record.totalTokens ?? null,
        latency_ms: record.latencyMs,
        metadata: record.metadata ?? {},
        error_code: record.errorCode ?? null,
        error_message: record.errorMessage ?? null,
      });
    } catch (error) {
      // Accounting must not turn a completed provider response into a retry-prone failure.
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[TACIE] Failed to persist AI usage ${record.requestId}: ${message}`);
    }
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
    const startedAt = Date.now();
    const requestedProvider = this.provider ?? "default";
    const requestedModel = this.model ?? "default";
    const metadata = {
      application_id: "careeros-api",
      ...params.metadata,
    };
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
          metadata,
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI service request failed";
      await this.persistUsage({
        requestId,
        signatureType: params.signatureType,
        provider: requestedProvider,
        model: requestedModel,
        status: "ERROR",
        latencyMs: Date.now() - startedAt,
        metadata,
        errorCode: "AI_SERVICE_UNREACHABLE",
        errorMessage: message,
      });
      throw new AiGatewayError(message, 503, "AI_SERVICE_UNREACHABLE", true);
    }

    const body = await response.json().catch(() => null) as GatewayResponse | { detail?: unknown } | null;
    if (!response.ok) {
      const detail = body && "detail" in body ? body.detail : undefined;
      const providerDetail = typeof detail === "object" && detail !== null
        ? detail as { code?: string; message?: string; retryable?: boolean }
        : undefined;
      const gatewayError = new AiGatewayError(
        providerDetail?.message ?? "TACIE AI rejected the request",
        response.status >= 500 ? 503 : response.status,
        providerDetail?.code ?? "AI_PROVIDER_ERROR",
        providerDetail?.retryable ?? response.status >= 500
      );
      await this.persistUsage({
        requestId,
        signatureType: params.signatureType,
        provider: requestedProvider,
        model: requestedModel,
        status: "ERROR",
        latencyMs: Date.now() - startedAt,
        metadata,
        errorCode: gatewayError.code,
        errorMessage: gatewayError.message,
      });
      throw gatewayError;
    }

    const data = body as GatewayResponse;
    if (!data?.content || !data.request_id) {
      const gatewayError = new AiGatewayError(
        "TACIE AI returned an invalid response",
        502,
        "AI_INVALID_RESPONSE"
      );
      await this.persistUsage({
        requestId,
        signatureType: params.signatureType,
        provider: requestedProvider,
        model: requestedModel,
        status: "ERROR",
        latencyMs: Date.now() - startedAt,
        metadata,
        errorCode: gatewayError.code,
        errorMessage: gatewayError.message,
      });
      throw gatewayError;
    }

    await this.persistUsage({
      requestId: data.request_id,
      signatureType: params.signatureType,
      provider: data.provider ?? requestedProvider,
      model: data.model ?? requestedModel,
      status: "SUCCESS",
      latencyMs: data.latency_ms ?? Date.now() - startedAt,
      metadata,
      inputTokens: data.usage?.input_tokens,
      outputTokens: data.usage?.output_tokens,
      totalTokens: data.usage?.total_tokens,
    });

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
