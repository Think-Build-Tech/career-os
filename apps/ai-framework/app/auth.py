"""Bearer-token authentication for calling web applications."""

from __future__ import annotations

import hashlib
import hmac
from dataclasses import dataclass
from typing import Any

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config.settings import Settings, get_settings


@dataclass(frozen=True)
class ClientIdentity:
    client_id: str
    signature_type: str
    metadata: dict[str, Any]


bearer_scheme = HTTPBearer(auto_error=False)


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _identity_from_env(token: str, settings: Settings) -> ClientIdentity | None:
    for client_id, configured_token in settings.api_keys:
        if hmac.compare_digest(token, configured_token):
            return ClientIdentity(
                client_id=client_id,
                signature_type=settings.bootstrap_signature_type,
                metadata={"source": "environment"},
            )
    return None


def authenticate_client(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> ClientIdentity:
    """Authenticate a caller from the database or bootstrap environment keys."""

    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="A bearer token is required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    settings = get_settings()
    database = request.app.state.database
    client = database.find_client_by_token_hash(_token_hash(token))
    if client is not None:
        return ClientIdentity(
            client_id=client["client_id"],
            signature_type=client["signature_type"],
            metadata=client["metadata"],
        )

    identity = _identity_from_env(token, settings)
    if identity is not None:
        return identity

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or inactive bearer token",
        headers={"WWW-Authenticate": "Bearer"},
    )
