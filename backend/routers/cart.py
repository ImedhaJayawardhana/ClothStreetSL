from fastapi import APIRouter, Depends, HTTPException
from firebase.admin import db
from firebase.auth_verify import verify_token
from models.schemas import CartUpdate

router = APIRouter()


@router.get("/")
def get_cart(decoded_token: dict = Depends(verify_token)):
    """Return the authenticated user's cart from Firestore."""
    uid = decoded_token["uid"]
    doc = db.collection("cart").document(uid).get()
    if doc.exists:
        data = doc.to_dict()
        return {"items": data.get("items", [])}
    return {"items": []}


@router.put("/")
def save_cart(cart: CartUpdate, decoded_token: dict = Depends(verify_token)):
    """Save (overwrite) the authenticated user's cart in Firestore."""
    uid = decoded_token["uid"]
    items_data = [item.model_dump() for item in cart.items]
    db.collection("cart").document(uid).set({"items": items_data})
    return {"message": "Cart saved successfully", "count": len(items_data)}


@router.delete("/")
def clear_cart(decoded_token: dict = Depends(verify_token)):
    """Delete the authenticated user's entire cart document."""
    uid = decoded_token["uid"]
    doc_ref = db.collection("cart").document(uid)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.delete()
    return {"message": "Cart cleared"}


@router.delete("/{customer_id}/item/{provider_id}")
def cleanup_cart_item(
    customer_id: str, provider_id: str, decoded_token: dict = Depends(verify_token)
):
    uid = decoded_token["uid"]
    if customer_id != uid:
        raise HTTPException(status_code=403, detail="Unauthorized")

    try:
        # Search for matching item by customerId and either providerId or serviceType
        docs = db.collection("carts").where("customerId", "==", customer_id).stream()
        for d in docs:
            item = d.to_dict()
            if (
                item.get("providerId") == provider_id
                or item.get("serviceType") == provider_id
            ):
                db.collection("carts").document(d.id).delete()

        # Return 200 silently even if nothing is deleted as requested
        return {"message": "Cart cleanup successful"}
    except Exception as e:
        # Return silently on error to not break flow
        return {"message": "Cart cleanup successful", "note": str(e)}
