"""Environment-backed application settings."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


def _as_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _as_int(value: str | None, default: int) -> int:
    try:
        return int(value) if value is not None else default
    except ValueError as exc:
        raise RuntimeError(f"Invalid integer setting: {value!r}") from exc


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_env: str
    debug: bool

    default_provider: str
    bedrock_region: str
    bedrock_model: str | None
    bedrock_api_key: str | None
    bedrock_base_url: str | None
    openai_base_url: str | None
    openai_api_key: str | None
    openai_model: str | None
    provider_timeout_seconds: int

    api_keys: tuple[tuple[str, str], ...]
    bootstrap_signature_type: str
    cors_origins: tuple[str, ...]


def _parse_api_keys(value: str | None) -> tuple[tuple[str, str], ...]:
    """Parse ``client_id=token`` pairs used for initial client bootstrap."""

    if not value:
        return ()

    pairs: list[tuple[str, str]] = []
    for item in value.split(","):
        item = item.strip()
        if not item:
            continue
        client_id, separator, token = item.partition("=")
        if not separator or not client_id.strip() or not token:
            raise RuntimeError(
                "AI_SERVICE_API_KEYS must use comma-separated client_id=token pairs"
            )
        pairs.append((client_id.strip(), token.strip()))
    return tuple(pairs)


@lru_cache
def get_settings() -> Settings:
    """Load settings once per process."""

    return Settings(
        app_name=os.getenv("APP_NAME", "AI Framework Service"),
        app_env=os.getenv("APP_ENV", "development"),
        debug=_as_bool(os.getenv("DEBUG")),
        default_provider=os.getenv("LLM_PROVIDER", "bedrock"),
        bedrock_region=os.getenv("BEDROCK_REGION", "ap-south-1"),
        bedrock_model=os.getenv("BEDROCK_MODEL"),
        bedrock_api_key=os.getenv("BEDROCK_API_KEY"),
        bedrock_base_url=os.getenv("BEDROCK_BASE_URL"),
        openai_base_url=os.getenv("OPENAI_BASE_URL"),
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        openai_model=os.getenv("OPENAI_MODEL"),
        provider_timeout_seconds=_as_int(os.getenv("LLM_PROVIDER_TIMEOUT_SECONDS"), 120),
        api_keys=_parse_api_keys(os.getenv("AI_SERVICE_API_KEYS")),
        bootstrap_signature_type=os.getenv("AI_SERVICE_SIGNATURE_TYPE", "default"),
        cors_origins=tuple(
            origin.strip()
            for origin in os.getenv("CORS_ORIGINS", "").split(",")
            if origin.strip()
        ),
    )
