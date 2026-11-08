"""Adapter for OpenAI-compatible chat-completions APIs."""

from __future__ import annotations

import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request as UrlRequest
from urllib.request import urlopen

from app.providers.base import ProviderError, ProviderRequest, ProviderResponse


class OpenAICompatibleProvider:
    name = "openai_compatible"

    def __init__(self, base_url: str | None, api_key: str | None, default_model: str | None, timeout: int) -> None:
        self._base_url = (base_url or "").rstrip("/")
        self._api_key = api_key
        self._default_model = default_model
        self._timeout = timeout

    def generate(self, request: ProviderRequest) -> ProviderResponse:
        model = request.model or self._default_model
        if not self._base_url or not model:
            raise ProviderError("provider_not_configured", "OpenAI-compatible provider is not configured")

        payload: dict[str, Any] = {
            "model": model,
            "messages": request.messages,
        }
        if request.temperature is not None:
            payload["temperature"] = request.temperature
        if request.max_tokens is not None:
            payload["max_tokens"] = request.max_tokens

        headers = {"Content-Type": "application/json"}
        if self._api_key:
            headers["Authorization"] = f"Bearer {self._api_key}"
        url_request = UrlRequest(
            f"{self._base_url}/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        try:
            with urlopen(url_request, timeout=self._timeout) as response:
                data = json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            raise ProviderError("provider_http_error", "The provider rejected the request", exc.code >= 500) from exc
        except (URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise ProviderError("provider_unavailable", "The provider could not be reached", True) from exc

        try:
            message = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise ProviderError("invalid_provider_response", "The provider returned an invalid response") from exc

        usage = data.get("usage", {})
        return ProviderResponse(
            content=message if isinstance(message, str) else str(message),
            model=data.get("model", model),
            input_tokens=usage.get("prompt_tokens"),
            output_tokens=usage.get("completion_tokens"),
            total_tokens=usage.get("total_tokens"),
        )
