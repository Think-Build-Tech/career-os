# AI Framework Service

Reusable LLM gateway for multiple web applications. Calling applications use
one bearer token per application; every generation request is attributed to the
authenticated client, signature type, provider, model, latency, token usage,
and caller-supplied metadata in Aurora PostgreSQL.

## API

`GET /health` is a liveness check. `GET /ready` verifies the database. The
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

The service does not store prompts or completions in the usage table. Store only
the metadata needed for billing, analytics, and traceability.

## Configuration

Run with the environment file explicitly, for example:

```powershell
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --env-file .env
```

Required Aurora settings are `AURORA_DB_HOST`, `AURORA_DB_PORT`,
`AURORA_DB_USER`, `AURORA_DB_NAME`, and `AURORA_DB_REGION`. The application
role needs permission to generate an RDS IAM authentication token and the
database user must be configured for IAM authentication.

For local IAM authentication, configure an AWS CLI profile and pass it through
the environment:

```powershell
aws configure --profile careeros
$env:AWS_PROFILE = "careeros"
aws sts get-caller-identity --profile careeros
```

For local password authentication instead, set `AURORA_DB_PASSWORD` in the
runtime environment. Do not use `BEDROCK_API_KEY` as the database password;
that key is unrelated to Aurora authentication.

The default provider is Bedrock. Configure `BEDROCK_REGION`, `BEDROCK_MODEL`,
and `LLM_PROVIDER=bedrock`. The included `openai_compatible` adapter supports
OpenAI-compatible services by setting `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and
`OPENAI_MODEL`, then sending `"provider": "openai_compatible"`.

For initial bootstrap, `AI_SERVICE_API_KEYS` accepts comma-separated
`client_id=token` pairs. These are useful before database client records exist;
database-backed clients are preferred for normal operation. Provision one with:

```powershell
uv run --env-file .env python scripts/create_api_client.py career-webapp --signature-type career_assistant
```

## Adding a provider

Implement the `LLMProvider` contract in `app/providers`, return a
`ProviderResponse`, and register the adapter in
`app/providers/registry.py`. The HTTP endpoint and usage ledger do not need to
change.

## Deployment notes

Use server-to-server calls where possible. A bearer token embedded in a public
browser bundle is extractable by end users; if browser calls are required, put
a small backend-for-frontend in front of this service and configure
`CORS_ORIGINS` narrowly.
