from fastapi import APIRouter, Depends, HTTPException

from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import DesignerProfile, DesignerProfileUpdate

router = APIRouter()


@router.post("")
def create_designer(
    profile: DesignerProfile, decoded_token: dict = Depends(verify_token)
):
    uid = decoded_token["uid"]
    data = profile.dict()
    data["uid"] = uid
    db.collection("designers").document(uid).set(data)
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
        raise HTTPException(
            status_code=403, detail="You can only update your own profile"
        )
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    doc = db.collection("designers").document(designer_id).get()
    if doc.exists:
        db.collection("designers").document(designer_id).update(update_data)
    else:
        # Auto-create profile for new users
        update_data["uid"] = uid
        db.collection("designers").document(designer_id).set(update_data)
    return {"message": "Designer profile updated"}


@router.delete("/{designer_id}")
def delete_designer(
    designer_id: str,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    if uid != designer_id:
        raise HTTPException(
            status_code=403, detail="You can only delete your own profile"
        )
    doc = db.collection("designers").document(designer_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Designer not found")
    db.collection("designers").document(designer_id).delete()
    return {"message": "Designer profile deleted"}


# ─── NEW ENDPOINTS (added for dashboard integration) ─────────────────────────

# ── Pydantic models for new endpoints ──
from pydantic import BaseModel as _BaseModel
from typing import Optional as _Optional, List as _List


class _DesignerProfileBody(_BaseModel):
    """Request body for designer profile update (dashboard)."""

    name: _Optional[str] = None
    bio: _Optional[str] = None
    speciality: _Optional[str] = None
    location: _Optional[str] = None
    priceRange: _Optional[str] = None
    phone: _Optional[str] = None
    experience: _Optional[int] = None
    portfolioLinks: _Optional[_List[str]] = None


class _ProjectStatusBody(_BaseModel):
    """Request body for project/order status update."""

    status: str


@router.get("/dashboard")
def get_designer_dashboard(decoded_token: dict = Depends(verify_token)):
    """
    Returns dashboard stats for the logged-in designer:
    project counts, rating info, recent projects, recent reviews,
    and the designer's own profile data (for the edit form).
    """
    uid = decoded_token["uid"]

    # ── Fetch all orders/projects assigned to this designer ──
    orders_ref = db.collection("orders").where("designerId", "==", uid)
    all_projects = []
    for doc in orders_ref.stream():
        project = doc.to_dict()
        project["id"] = doc.id
        all_projects.append(project)

    # ── Count projects by status ──
    total_projects = len(all_projects)
    pending_projects = sum(
        1 for p in all_projects if (p.get("status") or "").lower() == "pending"
    )
    active_projects = sum(
        1
        for p in all_projects
        if (p.get("status") or "").lower()
        in ("processing", "in_progress", "in progress")
    )
    completed_projects = sum(
        1 for p in all_projects if (p.get("status") or "").lower() == "completed"
    )

    # ── Recent projects (last 5, sorted by createdAt descending) ──
    def get_timestamp(project):
        created = project.get("createdAt") or project.get("created_at")
        if created is None:
            return 0
        if hasattr(created, "timestamp"):
            return created.timestamp()
        return 0

    sorted_projects = sorted(all_projects, key=get_timestamp, reverse=True)
    recent_projects = []
    for p in sorted_projects[:5]:
        recent_projects.append(
            {
                "id": p.get("id"),
                "customerName": p.get("customerName", "Unknown"),
                "description": p.get("description")
                or (
                    p.get("items", [{}])[0].get("name") if p.get("items") else "Project"
                ),
                "status": p.get("status", "pending"),
                "budget": p.get("total_price") or p.get("budget") or 0,
                "createdAt": str(p.get("createdAt") or p.get("created_at") or ""),
            }
        )

    # ── Fetch reviews for this designer ──
    reviews_ref = (
        db.collection("reviews")
        .where("targetType", "==", "designer")
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

    # ── Fetch the designer's own profile (for the edit form) ──
    profile_data = {}
    profile_doc = db.collection("designers").document(uid).get()
    if profile_doc.exists:
        profile_data = profile_doc.to_dict()

    return {
        "totalProjects": total_projects,
        "pendingProjects": pending_projects,
        "activeProjects": active_projects,
        "completedProjects": completed_projects,
        "averageRating": average_rating,
        "totalReviews": total_reviews,
        "recentProjects": recent_projects,
        "recentReviews": recent_reviews,
        "profile": profile_data,
    }


@router.put("/profile")
def update_designer_own_profile(
    body: _DesignerProfileBody,
    decoded_token: dict = Depends(verify_token),
):
    """
    Designer updates their own profile in the 'designers' collection.
    Accepts: name, bio, speciality, location, priceRange, phone, experience, portfolioLinks.
    """
    uid = decoded_token["uid"]
    update_data = {k: v for k, v in body.dict().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    doc_ref = db.collection("designers").document(uid)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update(update_data)
    else:
        update_data["uid"] = uid
        doc_ref.set(update_data)

    return {"message": "Designer profile updated successfully"}


@router.patch("/orders/{order_id}/status")
def update_designer_order_status(
    order_id: str,
    body: _ProjectStatusBody,
    decoded_token: dict = Depends(verify_token),
):
    """
    Updates the status of a project/order in the 'orders' collection.
    Only allows if the order is assigned to this designer.
    Valid statuses: pending, in_progress, completed, cancelled.
    """
    uid = decoded_token["uid"]
    valid_statuses = ["pending", "in_progress", "completed", "cancelled"]

    if body.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
        )

    # Check the order exists and belongs to this designer
    order_ref = db.collection("orders").document(order_id)
    order_doc = order_ref.get()

    if not order_doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")

    order_data = order_doc.to_dict()
    if order_data.get("designerId") != uid:
        raise HTTPException(
            status_code=403, detail="This project is not assigned to you"
        )

    order_ref.update({"status": body.status})
    return {"message": f"Project status updated to {body.status}"}
