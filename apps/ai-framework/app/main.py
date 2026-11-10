from uuid import UUID, uuid4

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware

from app.auth import ClientIdentity, authenticate_client
from app.config.settings import get_settings
from app.models.generation import GenerateRequest, GenerateResponse
from app.providers.base import ProviderError
from app.providers.registry import build_provider_registry
from app.services.gateway import LLMGateway

settings = get_settings()
app = FastAPI(title=settings.app_name, debug=settings.debug)
app.state.gateway = LLMGateway(build_provider_registry(settings))

if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    )


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}


@app.get("/ready")
def readiness_check() -> dict[str, str]:
    return {"status": "ready"}


@app.post("/v1/generate", response_model=GenerateResponse)
def generate(
    payload: GenerateRequest,
    request: Request,
    client: ClientIdentity = Depends(authenticate_client),
) -> GenerateResponse:
    request_id_header = request.headers.get("X-Request-ID")
    try:
        request_id = UUID(request_id_header) if request_id_header else uuid4()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="X-Request-ID must be a valid UUID") from exc

    try:
        return request.app.state.gateway.generate(payload, client, request_id)
    except ProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"code": exc.code, "message": exc.message, "retryable": exc.retryable},
        ) from exc
