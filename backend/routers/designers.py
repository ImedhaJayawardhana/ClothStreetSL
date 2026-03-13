from fastapi import APIRouter, Depends, HTTPException

from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import DesignerProfile, DesignerProfileUpdate

router = APIRouter()


@router.post("")
def create_designer(profile: DesignerProfile, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    db.collection("designers").document(uid).set({
        "uid": uid,
        "name": profile.name,
        "style": profile.style,
        "portfolio_url": profile.portfolio_url,
        "price_range": profile.price_range,
    })
    return {"message": "Designer profile created", "uid": uid}


@router.get("")
def list_designers():
    docs = db.collection("designers").stream()
    return [doc.to_dict() for doc in docs]


@router.get("/{designer_id}")
def get_designer(designer_id: str):
    doc = db.collection("designers").document(designer_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Designer not found")
    return doc.to_dict()


@router.patch("/{designer_id}")
def update_designer(
    designer_id: str,
    updates: DesignerProfileUpdate,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    if uid != designer_id:
        raise HTTPException(status_code=403, detail="You can only update your own profile")
    doc = db.collection("designers").document(designer_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Designer not found")
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    db.collection("designers").document(designer_id).update(update_data)
    return {"message": "Designer profile updated"}


@router.delete("/{designer_id}")
def delete_designer(
    designer_id: str,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    if uid != designer_id:
        raise HTTPException(status_code=403, detail="You can only delete your own profile")
    doc = db.collection("designers").document(designer_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Designer not found")
    db.collection("designers").document(designer_id).delete()
    return {"message": "Designer profile deleted"}