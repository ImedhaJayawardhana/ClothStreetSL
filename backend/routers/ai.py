from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from firebase.admin import db

router = APIRouter()


class ChatRequest(BaseModel):
    prompt: str
    userId: Optional[str] = None


# A simple rule-based AI function
def process_ai_chat(
    prompt: str,
    user_measurements: dict,
    fabrics: list,
    cart_items: list = None,
    tailors: list = None,
    designers: list = None,
):
    prompt_lower = prompt.lower()
    cart_items = cart_items or []
    tailors = tailors or []
    designers = designers or []

    # Analyze intent
    needs_size_match = (
        "fits me" in prompt_lower
        or "my size" in prompt_lower
        or "calculate" in prompt_lower
    )
    needs_provider_match = (
        "matching" in prompt_lower
        or "perfect" in prompt_lower
        or "find" in prompt_lower
    ) and ("tailor" in prompt_lower or "designer" in prompt_lower)

    # Filtering fabrics based on simple keyword matches
    matched_fabrics = []
    matched_providers = []

    # 1. Colors & Materials
    color_keywords = [
        "white",
        "black",
        "blue",
        "red",
        "green",
        "yellow",
        "pink",
        "purple",
        "brown",
        "grey",
        "gray",
    ]
    type_keywords = [
        "cotton",
        "silk",
        "linen",
        "polyester",
        "denim",
        "chiffon",
        "wool",
        "rayon",
        "velvet",
    ]

    found_colors = [c for c in color_keywords if c in prompt_lower]
    found_types = [t for t in type_keywords if t in prompt_lower]

    for f in fabrics:
        f_name_lower = f.get("name", "").lower()
        f_type_lower = f.get("type", "").lower()
        f_color_lower = f.get("color", "").lower()

        if found_colors and not any(
            c in f_name_lower or c in f_color_lower for c in found_colors
        ):
            continue
        if found_types and not any(
            t in f_name_lower or t in f_type_lower for t in found_types
        ):
            continue
        matched_fabrics.append(f)

    # 2. Provider Matching (Tailors/Designers)
    if needs_provider_match:
        target_materials = set(found_types)

        # If user refers to cart, extract materials from cart items
        if "cart" in prompt_lower and cart_items:
            for item in cart_items:
                name = item.get("name", "").lower()
                for t in type_keywords:
                    if t in name:
                        target_materials.add(t)

        all_providers = tailors + designers
        for p in all_providers:
            p_speciality = p.get("speciality", "").lower()
            p_bio = p.get("bio", "").lower()

            # Simple matching: Does their speciality include the materials
            # we found?
            if target_materials:
                if any(m in p_speciality or m in p_bio for m in target_materials):
                    matched_providers.append(p)
            else:
                # If no specific material, return top rated/featured
                matched_providers.append(p)

        # Limit results
        matched_providers = matched_providers[:5]

    # 3. Calculate requirements if sizes are needed
    required_meters = 0
    message = (
        "Here are some beautiful fabrics I found for you based on your " "request!"
    )

    if needs_size_match:
        if user_measurements and (
            "chest" in user_measurements or "waist" in user_measurements
        ):
            chest = float(user_measurements.get("chest", 90))
            waist = float(user_measurements.get("waist", 75))

            if any(k in prompt_lower for k in ["shirt", "top", "dress"]):
                required_meters = round(chest * 0.025 + 0.5, 1)
            elif any(k in prompt_lower for k in ["pant", "denim", "trouser"]):
                required_meters = round(waist * 0.025 + 0.8, 1)
            else:
                required_meters = 2.5

            message = (
                f"Based on your profile measurements, you'll need "
                f"approximately {required_meters}m of fabric. "
                "Here are some perfect matches!"
            )
        else:
            message = (
                "It looks like you haven't updated your size chart yet! "
                "Please navigate to your profile to update your "
                "measurements (chest, waist, etc.), or you can tell me "
                "your sizes right here so I can give you accurate "
                "recommendations."
            )

    if needs_provider_match:
        if matched_providers:
            message = (
                "I've found some expert tailors and designers who specialize "
                "in your requested style or materials!"
            )
            if "cart" in prompt_lower:
                message = (
                    "I've analyzed your cart! Here are the best tailors and "
                    "designers to work with those specific materials."
                )
        else:
            message = (
                "I couldn't find a specific specialist for that material, "
                "but here are some of our top-rated professionals!"
            )
            matched_providers = (tailors + designers)[:3]

    # Fallback for fabrics
    if not matched_fabrics and not needs_provider_match:
        matched_fabrics = fabrics[:5]
        message = (
            "Try asking for specific colors or materials like 'white cotton' "
            "or 'match a tailor for my cart'!"
        )

    return {
        "message": message,
        "fabrics": matched_fabrics if not needs_provider_match else [],
        "providers": matched_providers,
        "required_meters": required_meters,
    }


@router.post("/chat")
def chat_with_ai(request: ChatRequest):
    measurements = {}
    cart_items = []

    # 1. Fetch user measurements & cart if userId exists
    if request.userId:
        user_doc = db.collection("users").document(request.userId).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            measurements = user_data.get("measurements", {})

        cart_doc = db.collection("cart").document(request.userId).get()
        if cart_doc.exists:
            cart_items = cart_doc.to_dict().get("items", [])

    # 2. Fetch all data
    fabrics_ref = db.collection("fabrics").stream()
    fabrics = [
        doc.to_dict() | {"id": doc.id}
        for doc in fabrics_ref
        if not doc.to_dict().get("hidden")
    ]

    tailors_ref = db.collection("tailors").stream()
    tailors = [doc.to_dict() | {"id": doc.id, "type": "tailor"} for doc in tailors_ref]

    designers_ref = db.collection("designers").stream()
    designers = [
        doc.to_dict() | {"id": doc.id, "type": "designer"} for doc in designers_ref
    ]

    # 3. Process the AI intent
    response = process_ai_chat(
        request.prompt, measurements, fabrics, cart_items, tailors, designers
    )

    return response
