"""Provision a database-backed API client.

Usage:
    uv run python scripts/create_api_client.py my-webapp --signature-type resume_review
"""

from __future__ import annotations

import argparse
import getpass
import hashlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config.aurora_db import connect_to_aurora


def main() -> int:
    parser = argparse.ArgumentParser(description="Create or replace an AI service API client")
    parser.add_argument("client_id", help="Stable identifier for the calling web app")
    parser.add_argument("--signature-type", default="default")
    args = parser.parse_args()

    token = getpass.getpass("Token (leave blank to generate one): ")
    if not token:
        import secrets

        token = secrets.token_urlsafe(32)

    database = connect_to_aurora()
    try:
        database.initialize_schema()
        with database.connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO api_clients (client_id, token_hash, signature_type)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (client_id) DO UPDATE SET
                        token_hash = EXCLUDED.token_hash,
                        signature_type = EXCLUDED.signature_type,
                        active = TRUE
                    """,
                    (args.client_id, hashlib.sha256(token.encode()).hexdigest(), args.signature_type),
                )
        print(f"Client '{args.client_id}' provisioned.")
        print(f"Bearer token: {token}")
    finally:
        database.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
