from fastapi import APIRouter, Depends, HTTPException
from firebase.admin import db
from firebase.auth_verify import verify_token

router = APIRouter()


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
