from fastapi import APIRouter, Depends, HTTPException
from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import Quotation, QuotationStatusUpdate

router = APIRouter()


@router.post("")
def create_quotation(quotation: Quotation, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc_ref = db.collection("quotations").add(
        {
            "customer_id": uid,
            "tailor_id": quotation.tailor_id,
            "fabric_id": quotation.fabric_id,
            "description": quotation.description,
            "status": "pending",
            "price": quotation.price,
        }
    )
    return {"message": "Quotation created", "quotation_id": doc_ref[1].id}


@router.get("/my")
def get_my_quotations(decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    as_customer = (
        db.collection("quotations").where("customer_id", "==", uid).stream()
    )
    as_tailor = db.collection("quotations").where("tailor_id", "==", uid).stream()
    results = []
    seen_ids = set()
    for doc in as_customer:
        data = doc.to_dict()
        data["id"] = doc.id
        results.append(data)
        seen_ids.add(doc.id)
    for doc in as_tailor:
        if doc.id not in seen_ids:
            data = doc.to_dict()
            data["id"] = doc.id
            results.append(data)
    return results


@router.get("/{quotation_id}")
def get_quotation(quotation_id: str, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc = db.collection("quotations").document(quotation_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Quotation not found")
    data = doc.to_dict()
    if uid != data.get("customer_id") and uid != data.get("tailor_id"):
        raise HTTPException(
            status_code=403, detail="You are not involved in this quotation"
        )
    data["id"] = doc.id
    return data


@router.patch("/{quotation_id}/status")
def update_quotation_status(
    quotation_id: str,
    status_update: QuotationStatusUpdate,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    doc = db.collection("quotations").document(quotation_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Quotation not found")
    if uid != doc.to_dict().get("tailor_id"):
        raise HTTPException(
            status_code=403, detail="Only the tailor can update quotation status"
        )
    db.collection("quotations").document(quotation_id).update(
        {"status": status_update.status}
    )
    return {"message": "Quotation status updated", "status": status_update.status}