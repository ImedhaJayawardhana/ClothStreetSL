from fastapi import APIRouter, Depends, HTTPException
from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import TailorProfile, TailorProfileUpdate

router = APIRouter()


@router.post("")
def create_tailor(profile: TailorProfile, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    db.collection("tailors").document(uid).set({
        "uid": uid,
        "name": profile.name,
        "skills": profile.skills,
        "location": profile.location,
        "price_range": profile.price_range,
        "availability": profile.availability,
    })
    return {"message": "Tailor profile created", "uid": uid}


@router.get("")
def list_tailors():
    docs = db.collection("tailors").stream()
    return [doc.to_dict() for doc in docs]


@router.get("/{tailor_id}")
def get_tailor(tailor_id: str):
    doc = db.collection("tailors").document(tailor_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Tailor not found")
    return doc.to_dict()


@router.patch("/{tailor_id}")
def update_tailor(tailor_id: str, updates: TailorProfileUpdate, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    if uid != tailor_id:
        raise HTTPException(status_code=403, detail="You can only update your own profile")
    doc = db.collection("tailors").document(tailor_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Tailor not found")
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    db.collection("tailors").document(tailor_id).update(update_data)
    return {"message": "Tailor profile updated"}