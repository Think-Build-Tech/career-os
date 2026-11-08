"""Aurora PostgreSQL connection pool and schema helpers."""

from __future__ import annotations

from contextlib import contextmanager
from typing import Any, Iterator

import boto3
from botocore.exceptions import NoCredentialsError, ProfileNotFound
import psycopg2
from psycopg2.extras import Json
from psycopg2.pool import ThreadedConnectionPool

from app.config.settings import Settings, get_settings


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS api_clients (
    client_id VARCHAR(128) PRIMARY KEY,
    token_hash CHAR(64) UNIQUE NOT NULL,
    signature_type VARCHAR(128) NOT NULL DEFAULT 'default',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_records (
    id BIGSERIAL PRIMARY KEY,
    request_id UUID NOT NULL,
    client_id VARCHAR(128) NOT NULL,
    application_id VARCHAR(256),
    signature_type VARCHAR(128) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    model VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL,
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    latency_ms INTEGER NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    error_code VARCHAR(128),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_records_client_created
    ON usage_records (client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_records_signature_created
    ON usage_records (signature_type, created_at DESC);
"""


class AuroraDatabase:
    """Thread-safe connection pool for synchronous FastAPI worker threads."""

    def __init__(self, pool: ThreadedConnectionPool) -> None:
        self._pool = pool

    @contextmanager
    def connection(self) -> Iterator[Any]:
        connection = self._pool.getconn()
        try:
            yield connection
            connection.commit()
        except BaseException:
            connection.rollback()
            raise
        finally:
            self._pool.putconn(connection)

    def initialize_schema(self) -> None:
        with self.connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(SCHEMA_SQL)

    def healthcheck(self) -> None:
        with self.connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")

    def find_client_by_token_hash(self, token_hash: str) -> dict[str, Any] | None:
        with self.connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT client_id, signature_type, metadata
                    FROM api_clients
                    WHERE token_hash = %s AND active = TRUE
                    """,
                    (token_hash,),
                )
                row = cursor.fetchone()
        if row is None:
            return None
        return {"client_id": row[0], "signature_type": row[1], "metadata": row[2] or {}}

    def record_usage(self, record: dict[str, Any]) -> int:
        with self.connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO usage_records (
                        request_id, client_id, application_id, signature_type,
                        provider, model, status, input_tokens, output_tokens,
                        total_tokens, latency_ms, metadata, error_code, error_message
                    ) VALUES (
                        %(request_id)s, %(client_id)s, %(application_id)s, %(signature_type)s,
                        %(provider)s, %(model)s, %(status)s, %(input_tokens)s, %(output_tokens)s,
                        %(total_tokens)s, %(latency_ms)s, %(metadata)s, %(error_code)s,
                        %(error_message)s
                    )
                    RETURNING id
                    """,
                    {**record, "metadata": Json(record.get("metadata", {}))},
                )
                return int(cursor.fetchone()[0])

    def close(self) -> None:
        self._pool.closeall()


def connect_to_aurora(settings: Settings | None = None) -> AuroraDatabase:
    """Create and validate an IAM-authenticated Aurora PostgreSQL pool."""

    settings = settings or get_settings()
    region = settings.aurora_region
    host = settings.aurora_db_host
    port = settings.aurora_db_port
    database = settings.aurora_db_name
    username = settings.aurora_db_user

    if not host:
        raise RuntimeError("AURORA_DB_HOST must be set before starting the application")

    if settings.aurora_db_password:
        password = settings.aurora_db_password
    else:
        try:
            session = boto3.Session(profile_name=settings.aws_profile) if settings.aws_profile else boto3.Session()
            rds_client = session.client("rds", region_name=region)
            password = rds_client.generate_db_auth_token(
                DBHostname=host,
                Port=port,
                DBUsername=username,
                Region=region,
            )
        except ProfileNotFound as exc:
            raise RuntimeError(
                f"AWS profile '{settings.aws_profile}' was not found. "
                "Run 'aws configure --profile <name>' or remove AWS_PROFILE."
            ) from exc
        except NoCredentialsError as exc:
            raise RuntimeError(
                "No AWS credentials were found for Aurora IAM authentication. "
                "Configure AWS_PROFILE/AWS credentials or set AURORA_DB_PASSWORD "
                "for password authentication. BEDROCK_API_KEY cannot authenticate to Aurora."
            ) from exc

    pool = ThreadedConnectionPool(
        minconn=settings.aurora_db_pool_min,
        maxconn=settings.aurora_db_pool_max,
        host=host,
        port=port,
        database=database,
        user=username,
        password=password,
        sslmode=settings.aurora_db_sslmode,
    )
    database_pool = AuroraDatabase(pool)
    try:
        database_pool.healthcheck()
    except Exception:
        database_pool.close()
        raise
    return database_pool


def close_aurora_connection(database: AuroraDatabase | None) -> None:
    """Close an Aurora pool if it exists."""

    if database is not None:
        database.close()
