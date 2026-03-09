from fastapi import APIRouter, Depends, HTTPException

from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import User

router = APIRouter()


@router.post("/register")
def register_user(user: User, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    db.collection("users").document(uid).set(
        {
            "uid": uid,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        }
    )
    return {"message": "User registered successfully", "uid": uid}


@router.get("/me")
def get_current_user(decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    return doc.to_dict()
