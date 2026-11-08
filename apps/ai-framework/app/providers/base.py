"""Provider-neutral request and response contracts."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


@dataclass(frozen=True)
class ProviderRequest:
    messages: list[dict[str, str]]
    model: str | None
    temperature: float | None
    max_tokens: int | None


@dataclass(frozen=True)
class ProviderResponse:
    content: str
    model: str
    input_tokens: int | None = None
    output_tokens: int | None = None
    total_tokens: int | None = None
    metadata: dict[str, str] = field(default_factory=dict)


class ProviderError(Exception):
    """A provider failure safe to expose as a gateway error."""

    def __init__(self, code: str, message: str, retryable: bool = False) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.retryable = retryable


class LLMProvider(Protocol):
    name: str

    def generate(self, request: ProviderRequest) -> ProviderResponse:
        ...
