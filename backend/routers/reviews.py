from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from firebase.auth_verify import verify_token
from firebase.admin import db

router = APIRouter()


# ── What a review looks like when submitted ──────────────────
class ReviewCreate(BaseModel):
    targetType: str  # "product", "tailor", or "designer"
    targetId: str  # ID of the product/tailor/designer
    rating: int  # 1 to 5
    comment: Optional[str] = ""


# ────────────────────────────────────────────────────────────
# POST /reviews/  → Submit a new review
# ────────────────────────────────────────────────────────────
@router.post("/")
def submit_review(data: ReviewCreate, current_user: dict = Depends(verify_token)):

    # 1. Validate rating is between 1 and 5
    if not 1 <= data.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # 2. Prevent self-reviews
    if data.targetType in ["tailor", "designer"]:
        if current_user["uid"] == data.targetId:
            raise HTTPException(
                status_code=400,
                detail=f"You cannot review your own {data.targetType} profile",
            )

    if data.targetType == "product":
        product_doc = db.collection("fabrics").document(data.targetId).get()
        if product_doc.exists:
            product = product_doc.to_dict()
            if (
                product.get("supplierId") == current_user["uid"]
                or product.get("sellerId") == current_user["uid"]
            ):
                raise HTTPException(
                    status_code=400, detail="You cannot review your own product"
                )

    # 3. Check customer hasn't already reviewed this target
    existing = (
        db.collection("reviews")
        .where("targetId", "==", data.targetId)
        .where("customerId", "==", current_user["uid"])
        .where("isDeleted", "==", False)
        .get()
    )
    if len(existing) > 0:
        raise HTTPException(status_code=400, detail="You already reviewed this")

    # 3. Save the review to Firestore
    review = {
        "targetType": data.targetType,
        "targetId": data.targetId,
        "customerId": current_user["uid"],
        "customerName": current_user.get("name", "Anonymous"),
        "rating": data.rating,
        "comment": data.comment,
        "createdAt": datetime.utcnow().isoformat(),
        "isDeleted": False,
    }
    doc_ref = db.collection("reviews").add(review)
    review_id = doc_ref[1].id

    # 4. Recalculate average rating on the target
    recalculate_rating(data.targetType, data.targetId)

    # 5. If it's a product review → notify the supplier
    if data.targetType == "product":
        notify_supplier(data.targetId, review_id, review)

    return {"message": "Review submitted successfully", "reviewId": review_id}


# ────────────────────────────────────────────────────────────
# GET /reviews/{targetType}/{targetId} → Get all reviews
# ────────────────────────────────────────────────────────────
@router.get("/{targetType}/{targetId}")
def get_reviews(targetType: str, targetId: str):
    docs = (
        db.collection("reviews")
        .where("targetId", "==", targetId)
        .where("targetType", "==", targetType)
        .where("isDeleted", "==", False)
        .stream()
    )

    reviews = [{"id": d.id, **d.to_dict()} for d in docs]
    return reviews


# ────────────────────────────────────────────────────────────
# DELETE /reviews/{reviewId} → Customer deletes their review
# ────────────────────────────────────────────────────────────
@router.delete("/{reviewId}")
def delete_review(reviewId: str, current_user: dict = Depends(verify_token)):

    doc = db.collection("reviews").document(reviewId).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Review not found")

    review = doc.to_dict()

    # Only the person who wrote it can delete it
    if review["customerId"] != current_user["uid"]:
        raise HTTPException(
            status_code=403, detail="You can only delete your own reviews"
        )

    # Soft delete — keep the data but mark as deleted
    db.collection("reviews").document(reviewId).update({"isDeleted": True})

    # Recalculate average after deletion
    recalculate_rating(review["targetType"], review["targetId"])

    return {"message": "Review deleted successfully"}


# ────────────────────────────────────────────────────────────
# GET /reviews/summary/{targetType}/{targetId}
# → Returns average rating and total count
# ────────────────────────────────────────────────────────────
@router.get("/summary/{targetType}/{targetId}")
def get_summary(targetType: str, targetId: str):
    docs = (
        db.collection("reviews")
        .where("targetId", "==", targetId)
        .where("isDeleted", "==", False)
        .stream()
    )

    ratings = [d.to_dict()["rating"] for d in docs]
    total = len(ratings)
    average = round(sum(ratings) / total, 1) if total > 0 else 0.0

    return {"averageRating": average, "totalReviews": total}


# ────────────────────────────────────────────────────────────
# GET /reviews/supplier/notifications
# → Supplier sees all reviews about their products
# ────────────────────────────────────────────────────────────
@router.get("/supplier/notifications")
def supplier_notifications(current_user: dict = Depends(verify_token)):
    if current_user.get("role") not in ["supplier", "admin"]:
        raise HTTPException(status_code=403, detail="Suppliers only")

    docs = (
        db.collection("users")
        .document(current_user["uid"])
        .collection("notifications")
        .stream()
    )

    return [{"id": d.id, **d.to_dict()} for d in docs]


# ────────────────────────────────────────────────────────────
# HELPER: Recalculate and save average rating on target doc
# ────────────────────────────────────────────────────────────
def recalculate_rating(targetType: str, targetId: str):
    docs = (
        db.collection("reviews")
        .where("targetId", "==", targetId)
        .where("isDeleted", "==", False)
        .stream()
    )

    ratings = [d.to_dict()["rating"] for d in docs]
    total = len(ratings)
    average = round(sum(ratings) / total, 1) if total > 0 else 0.0

    # Save to the correct collection
    collection_map = {
        "product": "fabrics",
        "tailor": "tailors",
        "designer": "designers",
    }
    collection = collection_map.get(targetType)
    if collection:
        db.collection(collection).document(targetId).update(
            {"averageRating": average, "totalReviews": total}
        )


# ────────────────────────────────────────────────────────────
# HELPER: Notify supplier when their product gets a review
# ────────────────────────────────────────────────────────────
def notify_supplier(productId: str, reviewId: str, review: dict):
    # Get the product to find who the supplier is
    product_doc = db.collection("fabrics").document(productId).get()
    if not product_doc.exists:
        return

    product = product_doc.to_dict()
    supplier_id = product.get("supplierId")
    if not supplier_id:
        return

    # Save notification under the supplier's profile
    db.collection("users").document(supplier_id).collection("notifications").document(
        reviewId
    ).set(
        {
            **review,
            "type": "product_review",
            "productId": productId,
            "read": False,
        }
    )
