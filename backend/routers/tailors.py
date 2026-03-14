from fastapi import APIRouter, Depends, HTTPException

from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import TailorProfile, TailorProfileUpdate

router = APIRouter()


@router.post("")
def create_tailor(profile: TailorProfile, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    data = profile.dict()
    data["uid"] = uid
    db.collection("tailors").document(uid).set(data)
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
def update_tailor(
    tailor_id: str,
    updates: TailorProfileUpdate,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    if uid != tailor_id:
        raise HTTPException(
            status_code=403, detail="You can only update your own profile"
        )
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    doc = db.collection("tailors").document(tailor_id).get()
    if doc.exists:
        db.collection("tailors").document(tailor_id).update(update_data)
    else:
        # Auto-create profile for new users
        update_data["uid"] = uid
        db.collection("tailors").document(tailor_id).set(update_data)
    return {"message": "Tailor profile updated"}


# ─── NEW ENDPOINTS (added for dashboard integration) ─────────────────────────


@router.get("/dashboard")
def get_tailor_dashboard(decoded_token: dict = Depends(verify_token)):
    """
    Returns dashboard stats for the logged-in tailor:
    order counts, rating info, recent orders, recent reviews,
    and the tailor's own profile data (for the edit form).
    """
    uid = decoded_token["uid"]

    # ── Fetch all orders assigned to this tailor ──
    orders_ref = db.collection("orders").where("tailorId", "==", uid)
    all_orders = []
    for doc in orders_ref.stream():
        order = doc.to_dict()
        order["id"] = doc.id
        all_orders.append(order)

    # ── Count orders by status ──
    total_orders = len(all_orders)
    pending_orders = sum(1 for o in all_orders if (o.get("status") or "").lower() == "pending")
    active_orders = sum(1 for o in all_orders if (o.get("status") or "").lower() in ("processing", "in_progress", "in progress"))
    completed_orders = sum(1 for o in all_orders if (o.get("status") or "").lower() == "completed")

    # ── Recent orders (last 5, sorted by createdAt descending) ──
    def get_timestamp(order):
        created = order.get("createdAt") or order.get("created_at")
        if created is None:
            return 0
        if hasattr(created, "timestamp"):
            return created.timestamp()
        return 0

    sorted_orders = sorted(all_orders, key=get_timestamp, reverse=True)
    recent_orders = []
    for o in sorted_orders[:5]:
        recent_orders.append({
            "id": o.get("id"),
            "customerName": o.get("customerName", "Unknown"),
            "description": o.get("description") or (o.get("items", [{}])[0].get("name") if o.get("items") else "Order"),
            "status": o.get("status", "pending"),
            "createdAt": str(o.get("createdAt") or o.get("created_at") or ""),
        })

    # ── Fetch reviews for this tailor ──
    reviews_ref = (
        db.collection("reviews")
        .where("targetType", "==", "tailor")
        .where("targetId", "==", uid)
    )
    all_reviews = []
    for doc in reviews_ref.stream():
        review = doc.to_dict()
        review["id"] = doc.id
        all_reviews.append(review)

    total_reviews = len(all_reviews)
    average_rating = 0.0
    if total_reviews > 0:
        average_rating = round(sum(r.get("rating", 0) for r in all_reviews) / total_reviews, 1)

    # Recent reviews (last 3)
    def get_review_timestamp(review):
        created = review.get("createdAt")
        if created is None:
            return 0
        if hasattr(created, "timestamp"):
            return created.timestamp()
        return 0

    sorted_reviews = sorted(all_reviews, key=get_review_timestamp, reverse=True)
    recent_reviews = []
    for r in sorted_reviews[:3]:
        recent_reviews.append({
            "id": r.get("id"),
            "rating": r.get("rating", 0),
            "comment": r.get("comment", ""),
            "userName": r.get("userName", "Anonymous"),
            "createdAt": str(r.get("createdAt") or ""),
        })

    # ── Fetch the tailor's own profile (for the edit form) ──
    profile_data = {}
    profile_doc = db.collection("tailors").document(uid).get()
    if profile_doc.exists:
        profile_data = profile_doc.to_dict()

    return {
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "activeOrders": active_orders,
        "completedOrders": completed_orders,
        "averageRating": average_rating,
        "totalReviews": total_reviews,
        "recentOrders": recent_orders,
        "recentReviews": recent_reviews,
        "profile": profile_data,
    }

# ── Pydantic models for new endpoints ──
from pydantic import BaseModel as _BaseModel
from typing import Optional as _Optional


class _TailorProfileBody(_BaseModel):
    """Request body for tailor profile update (dashboard)."""
    name: _Optional[str] = None
    bio: _Optional[str] = None
    speciality: _Optional[str] = None
    location: _Optional[str] = None
    pricePerItem: _Optional[float] = None
    phone: _Optional[str] = None
    experience: _Optional[int] = None


@router.put("/profile")
def update_tailor_own_profile(
    body: _TailorProfileBody,
    decoded_token: dict = Depends(verify_token),
):
    """
    Tailor updates their own profile in the 'tailors' collection.
    Accepts: name, bio, speciality, location, pricePerItem, phone, experience.
    """
    uid = decoded_token["uid"]
    update_data = {k: v for k, v in body.dict().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    doc_ref = db.collection("tailors").document(uid)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update(update_data)
    else:
        update_data["uid"] = uid
        doc_ref.set(update_data)

    return {"message": "Tailor profile updated successfully"}


class _OrderStatusBody(_BaseModel):
    """Request body for order status update."""
    status: str


@router.patch("/orders/{order_id}/status")
def update_tailor_order_status(
    order_id: str,
    body: _OrderStatusBody,
    decoded_token: dict = Depends(verify_token),
):
    """
    Updates the status of an order in the 'orders' collection.
    Only allows if the order is assigned to this tailor.
    Valid statuses: pending, in_progress, completed, cancelled.
    """
    uid = decoded_token["uid"]
    valid_statuses = ["pending", "in_progress", "completed", "cancelled"]

    if body.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
        )

    # Check the order exists and belongs to this tailor
    order_ref = db.collection("orders").document(order_id)
    order_doc = order_ref.get()

    if not order_doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")

    order_data = order_doc.to_dict()
    if order_data.get("tailorId") != uid:
        raise HTTPException(
            status_code=403, detail="This order is not assigned to you"
        )

    order_ref.update({"status": body.status})
    return {"message": f"Order status updated to {body.status}"}
