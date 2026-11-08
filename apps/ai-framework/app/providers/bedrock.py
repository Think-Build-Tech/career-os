"""Amazon Bedrock Converse API adapter."""

from __future__ import annotations

from typing import Any
import os

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.providers.base import ProviderError, ProviderRequest, ProviderResponse


class BedrockProvider:
    name = "bedrock"

    def __init__(self, region: str, default_model: str | None, api_key: str | None = None, base_url: str | None = None) -> None:
        self._region = region
        self._default_model = default_model
        self._api_key = api_key
        self._base_url = base_url
        self._client: Any | None = None

    @property
    def client(self) -> Any:
        if self._client is None:
            if self._api_key:
                os.environ.setdefault("AWS_BEARER_TOKEN_BEDROCK", self._api_key)
            kwargs: dict[str, Any] = {"region_name": self._region}
            if self._base_url:
                kwargs["endpoint_url"] = self._base_url
            self._client = boto3.client("bedrock-runtime", **kwargs)
        return self._client

    def generate(self, request: ProviderRequest) -> ProviderResponse:
        model = request.model or self._default_model
        if not model:
            raise ProviderError("model_not_configured", "No Bedrock model is configured")

        system: list[dict[str, str]] = []
        messages: list[dict[str, Any]] = []
        for message in request.messages:
            if message["role"] == "system":
                system.append({"text": message["content"]})
            else:
                messages.append(
                    {"role": message["role"], "content": [{"text": message["content"]}]}
                )

        if not messages:
            raise ProviderError("invalid_messages", "At least one user or assistant message is required")

        parameters: dict[str, Any] = {}
        if request.temperature is not None:
            parameters["temperature"] = request.temperature
        if request.max_tokens is not None:
            parameters["maxTokens"] = request.max_tokens

        payload: dict[str, Any] = {"modelId": model, "messages": messages}
        if system:
            payload["system"] = system
        if parameters:
            payload["inferenceConfig"] = parameters

        try:
            response = self.client.converse(**payload)
        except (BotoCoreError, ClientError) as exc:
            raise ProviderError("bedrock_error", "The Bedrock provider request failed", True) from exc

        output = response.get("output", {}).get("message", {}).get("content", [])
        content = "".join(block.get("text", "") for block in output if "text" in block)
        usage = response.get("usage", {})
        return ProviderResponse(
            content=content,
            model=response.get("metrics", {}).get("modelId", model),
            input_tokens=usage.get("inputTokens"),
            output_tokens=usage.get("outputTokens"),
            total_tokens=usage.get("totalTokens"),
        )
