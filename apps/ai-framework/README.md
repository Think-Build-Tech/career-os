# AI Framework Service

Reusable, database-free LLM gateway for server-side callers. Calling
applications use one bearer token per application. The Node API owns all
database persistence, including usage accounting and audit records.

## API

`GET /health` is a liveness check. `GET /ready` verifies that the process is
running. The
authenticated generation endpoint is:

```http
POST /v1/generate
Authorization: Bearer <web-app-token>
Content-Type: application/json
X-Request-ID: <optional UUID for tracing/idempotency correlation>
```

```json
{
  "signature_type": "resume_review",
  "provider": "bedrock",
  "model": "<optional model override>",
  "messages": [
    {"role": "system", "content": "You are a concise reviewer."},
    {"role": "user", "content": "Review this resume section..."}
  ],
  "temperature": 0.2,
  "max_tokens": 600,
  "metadata": {
    "application_id": "career-portal",
    "user_id": "internal-user-id",
    "feature": "resume-review",
    "environment": "production"
  }
}
```

The service never connects to the application database. The calling Node API
persists the metadata needed for billing, analytics, and traceability.

## Configuration

Run with the environment file explicitly, for example:

```powershell
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --env-file .env
```

Local development uses Ollama through its OpenAI-compatible API. Start Ollama,
then configure `LLM_PROVIDER=openai_compatible`,
`OPENAI_BASE_URL=http://127.0.0.1:11434/v1`, and an installed `OPENAI_MODEL`.
Docker Compose uses `host.docker.internal` to reach Ollama on the host.

Bedrock remains available for deployment by setting `LLM_PROVIDER=bedrock`,
`BEDROCK_REGION`, and `BEDROCK_MODEL`.

`AI_SERVICE_API_KEYS` accepts comma-separated `client_id=token` pairs. Keep the
AI service private and configure the Node API as its authenticated caller.

## Adding a provider

Implement the `LLMProvider` contract in `app/providers`, return a
`ProviderResponse`, and register the adapter in `app/providers/registry.py`.

## Deployment notes

Use server-to-server calls where possible. A bearer token embedded in a public
browser bundle is extractable by end users; if browser calls are required, put
a small backend-for-frontend in front of this service and configure
`CORS_ORIGINS` narrowly.
