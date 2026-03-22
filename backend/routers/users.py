from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from firebase_admin import auth
from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import DeleteAccountRequest, User

router = APIRouter()


@router.post("/register")
def register_user(user: User, decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    db.collection("users").document(uid).set(
        {
            "uid": uid,
            "email": user.email,
            "name": user.name,
            "role": user.role,
        }
    )
    return {"message": "User registered successfully", "uid": uid}


@router.get("/me")
def get_current_user(decoded_token: dict = Depends(verify_token)):
    uid = decoded_token["uid"]
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    return doc.to_dict()


@router.delete("/me")
def delete_current_user(
    body: DeleteAccountRequest,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]
    try:
        # ── 1. Collect all user data for backup ──────────────────
        backup = {
            "uid": uid,
            "deletedAt": datetime.now(timezone.utc).isoformat(),
            "reason": body.reason,
            "feedback": body.feedback,
        }

        # User profile
        user_doc = db.collection("users").document(uid).get()
        if user_doc.exists:
            backup["userData"] = user_doc.to_dict()

        # Tailor profile (if any)
        tailor_doc = db.collection("tailors").document(uid).get()
        if tailor_doc.exists:
            backup["tailorData"] = tailor_doc.to_dict()

        # Designer profile (if any)
        designer_doc = db.collection("designers").document(uid).get()
        if designer_doc.exists:
            backup["designerData"] = designer_doc.to_dict()

        # Cart data (if any)
        cart_doc = db.collection("cart").document(uid).get()
        if cart_doc.exists:
            backup["cartData"] = cart_doc.to_dict()

        # Orders placed by this user
        orders_query = db.collection("orders").where("uid", "==", uid).stream()
        orders_list = []
        for o in orders_query:
            orders_list.append({"id": o.id, **o.to_dict()})
        if orders_list:
            backup["orders"] = orders_list

        # Quotations created by this user
        quotations_query = (
            db.collection("quotations").where("customerId", "==", uid).stream()
        )
        quotations_list = []
        for q in quotations_query:
            quotations_list.append({"id": q.id, **q.to_dict()})
        if quotations_list:
            backup["quotations"] = quotations_list

        # ── 2. Store backup in deleted_accounts ──────────────────
        db.collection("deleted_accounts").document(uid).set(backup)

        # ── 3. Delete user documents from collections ────────────
        if user_doc.exists:
            db.collection("users").document(uid).delete()
        if tailor_doc.exists:
            db.collection("tailors").document(uid).delete()
        if designer_doc.exists:
            db.collection("designers").document(uid).delete()
        if cart_doc.exists:
            db.collection("cart").document(uid).delete()

        # ── 4. Delete Firebase Authentication account ────────────
        auth.delete_user(uid)

        return {"message": "Account successfully deleted and archived"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete account: {str(e)}"
        )
