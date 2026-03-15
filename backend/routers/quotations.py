from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException

from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import Quotation, QuotationUpdate

router = APIRouter()


# ─── POST /  →  Create new quotation ─────────────────
@router.post("")
def create_quotation(quotation: Quotation, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    now = datetime.utcnow().isoformat()

    doc_data = {
        "customerId": uid,
        "customerName": quotation.customerName or "",
        "customerEmail": quotation.customerEmail or "",
        "providerId": quotation.providerId,
        "providerName": quotation.providerName or "",
        "providerType": quotation.providerType or "",
        "serviceType": quotation.serviceType or "",
        "serviceMode": quotation.serviceMode or "",
        "linkedQuotationId": quotation.linkedQuotationId or "",
        "description": quotation.description or "",
        "budget": quotation.budget or 0,
        "deadline": quotation.deadline or "",
        "referenceImageUrl": quotation.referenceImageUrl or "",
        "requirements": quotation.requirements or "",
        "gender": quotation.gender or "",
        "expectedDate": quotation.expectedDate or "",
        "items": quotation.items or [],
        "measurements": quotation.measurements or {},
        "designImages": quotation.designImages or [],
        "status": "pending",
        "providerResponse": "",
        "proposedPrice": 0,
        "laborCharge": 0,
        "additionalCharges": 0,
        "additionalNote": "",
        "completionDate": "",
        "providerRemarks": "",
        "grandTotal": 0,
        "createdAt": now,
        "updatedAt": now,
    }

    _, doc_ref = db.collection("quotations").add(doc_data)
    return {"message": "Quotation created", "quotation_id": doc_ref.id}


# ─── GET /inbox  →  Quotations for the current provider ───
@router.get("/inbox")
def get_provider_inbox(decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    docs = db.collection("quotations").where("providerId", "==", uid).stream()
    results = []
    for d in docs:
        data = d.to_dict()
        data["id"] = d.id
        results.append(data)
    # Sort by createdAt descending
    results.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return results


# ─── GET /offers  →  Quotations sent by the current customer ───
@router.get("/offers")
def get_customer_offers(decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    docs = db.collection("quotations").where("customerId", "==", uid).stream()
    results = []
    for d in docs:
        data = d.to_dict()
        data["id"] = d.id
        results.append(data)
    results.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return results


# ─── GET /{quotation_id}  →  Get single quotation ─────────
@router.get("/{quotation_id}")
def get_quotation(quotation_id: str, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc = db.collection("quotations").document(quotation_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Quotation not found")
    data = doc.to_dict()
    if uid != data.get("customerId") and uid != data.get("providerId"):
        raise HTTPException(
            status_code=403, detail="You are not involved in this quotation"
        )
    data["id"] = doc.id
    return data


# ─── PATCH /{quotation_id}  →  Update quotation ──────────
@router.patch("/{quotation_id}")
def update_quotation(
    quotation_id: str,
    update: QuotationUpdate,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    doc = db.collection("quotations").document(quotation_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Quotation not found")

    data = doc.to_dict()
    if uid != data.get("customerId") and uid != data.get("providerId"):
        raise HTTPException(
            status_code=403, detail="You are not involved in this quotation"
        )

    # Build update dict from non-None fields
    update_data: Dict[str, Any] = {
        k: v for k, v in update.model_dump().items() if v is not None
    }
    update_data["updatedAt"] = datetime.utcnow().isoformat()

    order_id_str = None
    new_status = update_data.get("status", "").lower()
    if new_status in ["accepted", "design_in_progress"]:
        now = datetime.utcnow().isoformat()
        is_designer = data.get("providerType") == "designer"

        # Determine final price
        service_charge = data.get("laborCharge", 0) + data.get("additionalCharges", 0)
        final_price = service_charge if is_designer else (data.get("proposedPrice") or data.get("grandTotal") or 0)
        
        service_type = data.get("serviceType") or "Tailoring"
        provider_name = data.get("providerName") or "Provider"

        # Build items list to match existing frontend expectations
        items = []
        if not is_designer:
            for item in data.get("items", []):
                items.append(
                    {
                        "name": item.get("name", "Material"),
                        "quantity": item.get("quantity", 1),
                        "unit": item.get("unit", "m"),
                        "unitPrice": item.get("unitPrice", 0),
                        "image": item.image if hasattr(item, "image") else item.get("image", ""),
                    }
                )

        items.append(
            {
                "name": f"Service: {service_type} by {provider_name}",
                "quantity": 1,
                "unit": "service",
                "unitPrice": (
                    data.get("laborCharge", 0) + data.get("additionalCharges", 0)
                ),
            }
        )

        order_data = {
            "id": "",  # replaced by doc_ref.id after Firestore insert
            "customerId": data.get("customerId", ""),
            "customer_id": data.get("customerId", ""),  # legacy field for UI
            "providerId": data.get("providerId", ""),
            "quotationId": quotation_id,
            "serviceType": service_type,
            "description": data.get("description", ""),
            "finalPrice": final_price,
            "total_price": final_price,  # legacy field for UI
            "deadline": data.get("deadline") or data.get("expectedDate", ""),
            "status": "Confirmed",
            "items": items,
            "createdAt": now,
            "created_at": now,  # legacy field
        }

        _, doc_ref = db.collection("orders").add(order_data)
        order_id_str = doc_ref.id

    db.collection("quotations").document(quotation_id).update(update_data)

    # Return updated quotation and new orderId if applicable
    updated_doc = {**data, **update_data, "id": quotation_id}
    res = {"message": "Quotation updated", "quotation": updated_doc}
    if order_id_str:
        res["orderId"] = order_id_str
    return res


# ─── DELETE /{quotation_id}  →  Delete quotation ─────────
@router.delete("/{quotation_id}")
def delete_quotation(quotation_id: str, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc = db.collection("quotations").document(quotation_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Quotation not found")

    data = doc.to_dict()
    # Only the customer who created it can delete it
    if data.get("customerId") != uid:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own quotation requests",
        )

    if data.get("status", "").lower() not in ["pending", "rejected", "declined"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a quotation that is in progress or completed",
        )

    db.collection("quotations").document(quotation_id).delete()
    return {"message": "Quotation deleted successfully"}
