from typing import Optional as _Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel as _BaseModel

from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import TailorProfile, TailorProfileUpdate

router = APIRouter()


class _TailorProfileBody(_BaseModel):
    """Request body for tailor profile update (dashboard)."""

    name: _Optional[str] = None
    bio: _Optional[str] = None
    speciality: _Optional[str] = None
    location: _Optional[str] = None
    pricePerItem: _Optional[float] = None
    phone: _Optional[str] = None
    experience: _Optional[int] = None


class _OrderStatusBody(_BaseModel):
    """Request body for order status update."""

    status: str


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
    # Query by tailorId (old format) AND by providerId (new format, set by QuotationReview)
    seen_ids = set()
    all_orders = []
    for query_ref in [
        db.collection("orders").where("tailorId", "==", uid),
        db.collection("orders").where("providerId", "==", uid),
    ]:
        for doc in query_ref.stream():
            if doc.id not in seen_ids:
                seen_ids.add(doc.id)
                order = doc.to_dict()
                order["id"] = doc.id
                all_orders.append(order)

    # ── Count orders by status ──
    total_orders = len(all_orders)
    pending_orders = sum(
        1 for o in all_orders if (o.get("status") or "").lower() == "pending"
    )
    active_orders = sum(
        1
        for o in all_orders
        if (o.get("status") or "").lower()
        in ("processing", "in_progress", "in progress")
    )
    completed_orders = sum(
        1 for o in all_orders if (o.get("status") or "").lower() == "completed"
    )

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
        recent_orders.append(
            {
                "id": o.get("id"),
                "customerName": o.get("customerName", "Unknown"),
                "description": o.get("description")
                or (o.get("items", [{}])[0].get("name") if o.get("items") else "Order"),
                "status": o.get("status", "pending"),
                "createdAt": str(o.get("createdAt") or o.get("created_at") or ""),
            }
        )

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
        average_rating = round(
            sum(r.get("rating", 0) for r in all_reviews) / total_reviews, 1
        )

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
        recent_reviews.append(
            {
                "id": r.get("id"),
                "rating": r.get("rating", 0),
                "comment": r.get("comment", ""),
                "userName": r.get("userName", "Anonymous"),
                "createdAt": str(r.get("createdAt") or ""),
            }
        )

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


@router.patch("/orders/{order_id}/status")
def update_tailor_order_status(
    order_id: str,
    body: _OrderStatusBody,
    decoded_token: dict = Depends(verify_token),
):
    """
    Updates the status of an order in the 'orders' collection.
    Also syncs the linked quotation status so the customer's Order Tracking
    page reflects the change (OrderTracking.jsx reads quotation status).
    Valid statuses: pending, in_progress, tailoring, tailoring_done,
                    shipped_to_customer, delivered, completed, cancelled.
    """
    uid = decoded_token["uid"]
    valid_statuses = [
        "pending", "in_progress", "tailoring", "tailoring_done",
        "shipped_to_customer", "delivered", "completed", "cancelled",
    ]

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
    if order_data.get("tailorId") != uid and order_data.get("provider_id") != uid:
        # Fallback: allow if order has a quotationId and tailor owns that quotation
        quotation_id = order_data.get("quotationId")
        if quotation_id:
            q_doc = db.collection("quotations").document(quotation_id).get()
            if not q_doc.exists or q_doc.to_dict().get("providerId") != uid:
                raise HTTPException(status_code=403, detail="This order is not assigned to you")
        else:
            raise HTTPException(status_code=403, detail="This order is not assigned to you")

    # Update the order document
    order_ref.update({"status": body.status})

    # ── Sync the linked quotation so customer tracking reflects this change ──
    # Map order status → quotation status (the tracking page reads quotation status)
    order_to_quotation_status = {
        "pending":             "accepted",
        "in_progress":         "tailoring",
        "tailoring":           "tailoring",
        "tailoring_done":      "tailoring_done",
        "shipped_to_customer": "shipped_to_customer",
        "delivered":           "delivered",
        "completed":           "completed",
        "cancelled":           "cancelled",
    }
    quotation_status = order_to_quotation_status.get(body.status)
    quotation_id = order_data.get("quotationId")
    if quotation_id and quotation_status:
        q_ref = db.collection("quotations").document(quotation_id)
        if q_ref.get().exists:
            q_ref.update({"status": quotation_status})

    return {"message": f"Order status updated to {body.status}"}
