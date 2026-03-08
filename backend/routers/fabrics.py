from fastapi import APIRouter, Depends, HTTPException
from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import Fabric, FabricUpdate

router = APIRouter()


@router.post("")
def create_fabric(fabric: Fabric, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc_ref = db.collection("fabrics").add(
        {
            "name": fabric.name,
            "type": fabric.type,
            "color": fabric.color,
            "price": fabric.price,
            "stock": fabric.stock,
            "supplier_id": uid,
        }
    )
    return {"message": "Fabric listing created", "fabric_id": doc_ref[1].id}


@router.get("")
def list_fabrics():
    docs = db.collection("fabrics").stream()
    results = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        results.append(data)
    return results


@router.get("/{fabric_id}")
def get_fabric(fabric_id: str):
    doc = db.collection("fabrics").document(fabric_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Fabric not found")
    data = doc.to_dict()
    data["id"] = doc.id
    return data


@router.patch("/{fabric_id}")
def update_fabric(
    fabric_id: str,
    updates: FabricUpdate,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    doc = db.collection("fabrics").document(fabric_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Fabric not found")
    if doc.to_dict().get("supplier_id") != uid:
        raise HTTPException(
            status_code=403, detail="You can only update your own fabric listings"
        )
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    db.collection("fabrics").document(fabric_id).update(update_data)
    return {"message": "Fabric updated"}