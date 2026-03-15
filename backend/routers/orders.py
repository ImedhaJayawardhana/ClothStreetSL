from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import Order
router = APIRouter()

def _stock_status(stock: float) -> str:
    if stock <= 0:
        return "out"
    if stock <= 10:
        return "low"
    return "in"

@router.post("")
def create_order(order: Order, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc_ref = db.collection("orders").add(
        {
            "customer_id": uid,
            "items": order.items,
            "total_price": order.total_price,
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
        }
    )
    # ── Deduct stock for each ordered fabric ──────────────────────────────────
    for item in order.items:
        fabric_id = item.get("id")
        qty = item.get("quantity", 0)
        if not fabric_id or qty <= 0:
            continue
        fab_ref = db.collection("fabrics").document(fabric_id)
        fab_doc = fab_ref.get()
        if not fab_doc.exists:
            continue
        # Atomically reduce stock (floor at 0)
        current_stock = fab_doc.to_dict().get("stock", 0)
        new_stock = max(0, current_stock - qty)
        fab_ref.update({
            "stock": new_stock,
            "stockStatus": _stock_status(new_stock),
        })
    return {"message": "Order placed successfully", "order_id": doc_ref[1].id}

@router.get("/my")
def get_my_orders(decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    docs = db.collection("orders").where("customer_id", "==", uid).stream()
    results = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        results.append(data)
    return results

@router.get("/{order_id}")
def get_order(order_id: str, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    data = doc.to_dict()
    if data.get("customer_id") != uid:
        raise HTTPException(status_code=403, detail="You can only view your own orders")
    data["id"] = doc.id
    return data

@router.patch("/{order_id}/status")
def update_order_status(
    order_id: str,
    status: str,
    decoded_token: dict = Depends(verify_token),
):
    valid_statuses = ["pending", "processing", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}"
        )
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    db.collection("orders").document(order_id).update({"status": status})
    return {"message": "Order status updated", "status": status}

@router.delete("/{order_id}")
def cancel_order(order_id: str, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    data = doc.to_dict()
    if data.get("customer_id") != uid:
        raise HTTPException(
            status_code=403, detail="You can only cancel your own orders"
        )
    if data.get("status") == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel a completed order")
    db.collection("orders").document(order_id).update({"status": "cancelled"})
    return {"message": "Order cancelled successfully"}
