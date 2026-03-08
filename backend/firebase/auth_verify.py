import firebase_admin.auth
from fastapi import Header, HTTPException


def verify_token(authorization: str = Header(...)) -> dict:
    """
    FastAPI dependency — extracts and verifies Firebase Bearer token.
    Returns the decoded token dict containing uid, email, etc.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Invalid authorization header format"
        )

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token = firebase_admin.auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")