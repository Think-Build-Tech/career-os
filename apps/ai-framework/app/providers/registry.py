"""Provider registry used to keep the gateway provider-agnostic."""

from __future__ import annotations

from app.config.settings import Settings
from app.providers.base import LLMProvider, ProviderError
from app.providers.bedrock import BedrockProvider
from app.providers.openai_compatible import OpenAICompatibleProvider


class ProviderRegistry:
    def __init__(self, providers: dict[str, LLMProvider], default_provider: str) -> None:
        self._providers = providers
        self.default_provider = default_provider

    def get(self, name: str | None) -> tuple[str, LLMProvider]:
        provider_name = name or self.default_provider
        provider = self._providers.get(provider_name)
        if provider is None:
            raise ProviderError("unknown_provider", f"Provider '{provider_name}' is not enabled")
        return provider_name, provider

    def register(self, name: str, provider: LLMProvider) -> None:
        """Register a custom adapter without changing gateway orchestration."""

        self._providers[name] = provider


def build_provider_registry(settings: Settings) -> ProviderRegistry:
    return ProviderRegistry(
        providers={
            "bedrock": BedrockProvider(
                settings.bedrock_region,
                settings.bedrock_model,
                settings.bedrock_api_key,
                settings.bedrock_base_url,
            ),
            "openai_compatible": OpenAICompatibleProvider(
                settings.openai_base_url,
                settings.openai_api_key,
                settings.openai_model,
                settings.provider_timeout_seconds,
            ),
        },
        default_provider=settings.default_provider,
    )
