"""LLM gateway orchestration and usage accounting."""

from __future__ import annotations

import logging
import time
from typing import Any
from uuid import UUID

from app.auth import ClientIdentity
from app.config.aurora_db import AuroraDatabase
from app.models.generation import GenerateRequest, GenerateResponse, Usage
from app.providers.base import ProviderError, ProviderRequest
from app.providers.registry import ProviderRegistry


logger = logging.getLogger(__name__)


class LLMGateway:
    def __init__(self, database: AuroraDatabase, providers: ProviderRegistry) -> None:
        self._database = database
        self._providers = providers

    def generate(
        self,
        request: GenerateRequest,
        client: ClientIdentity,
        request_id: UUID,
    ) -> GenerateResponse:
        provider_name = request.provider or self._providers.default_provider
        provider = None
        model = request.model or "unknown"
        started = time.perf_counter()
        response = None
        provider_error: ProviderError | None = None
        usage_record_id: int | None = None

        try:
            provider_name, provider = self._providers.get(request.provider)
            response = provider.generate(
                ProviderRequest(
                    messages=[message.model_dump() for message in request.messages],
                    model=request.model,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens,
                )
            )
            model = response.model
        except ProviderError as exc:
            provider_error = exc
            raise
        except Exception as exc:
            provider_error = ProviderError("provider_internal_error", "The provider request failed")
            raise provider_error from exc
        finally:
            latency_ms = max(0, round((time.perf_counter() - started) * 1000))
            usage_record_id = self._record_usage(
                request=request,
                client=client,
                request_id=request_id,
                provider=provider_name,
                model=model or "unknown",
                latency_ms=latency_ms,
                response=response,
                provider_error=provider_error,
            )

        assert response is not None
        return GenerateResponse(
            request_id=request_id,
            client_id=client.client_id,
            provider=provider_name,
            model=response.model,
            content=response.content,
            usage=Usage(
                input_tokens=response.input_tokens,
                output_tokens=response.output_tokens,
                total_tokens=response.total_tokens,
            ),
            latency_ms=latency_ms,
            usage_record_id=usage_record_id,
        )

    def _record_usage(
        self,
        request: GenerateRequest,
        client: ClientIdentity,
        request_id: UUID,
        provider: str,
        model: str,
        latency_ms: int,
        response: Any,
        provider_error: ProviderError | None,
    ) -> int | None:
        status = "error" if provider_error else "success"
        try:
            return self._database.record_usage(
                {
                    "request_id": str(request_id),
                    "client_id": client.client_id,
                    "application_id": request.metadata.get("application_id"),
                    "signature_type": request.signature_type or client.signature_type,
                    "provider": provider,
                    "model": model,
                    "status": status,
                    "input_tokens": getattr(response, "input_tokens", None),
                    "output_tokens": getattr(response, "output_tokens", None),
                    "total_tokens": getattr(response, "total_tokens", None),
                    "latency_ms": latency_ms,
                    "metadata": {
                        **client.metadata,
                        **request.metadata,
                    },
                    "error_code": provider_error.code if provider_error else None,
                    "error_message": provider_error.message if provider_error else None,
                }
            )
        except Exception:
            # Never turn a completed provider call into a retry-prone 500 solely
            # because accounting is temporarily unavailable. Alert on this in
            # production and replay from logs/telemetry if strict billing is needed.
            logger.exception("Failed to record usage for request %s", request_id)
            return None
