"""Database-free LLM gateway orchestration."""

from __future__ import annotations

import time
from uuid import UUID

from app.auth import ClientIdentity
from app.models.generation import GenerateRequest, GenerateResponse, Usage
from app.providers.base import ProviderError, ProviderRequest
from app.providers.registry import ProviderRegistry


class LLMGateway:
    def __init__(self, providers: ProviderRegistry) -> None:
        self._providers = providers

    def generate(
        self,
        request: GenerateRequest,
        client: ClientIdentity,
        request_id: UUID,
    ) -> GenerateResponse:
        provider_name = request.provider or self._providers.default_provider
        started = time.perf_counter()

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
        except ProviderError:
            raise
        except Exception as exc:
            raise ProviderError(
                "provider_internal_error", "The provider request failed"
            ) from exc

        latency_ms = max(0, round((time.perf_counter() - started) * 1000))
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
        )
