from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from firebase.admin import db

router = APIRouter()


class ChatRequest(BaseModel):
    prompt: str
    userId: Optional[str] = None


# A simple rule-based AI function
def process_ai_chat(prompt: str, user_measurements: dict, fabrics: list):
    prompt_lower = prompt.lower()

    # Analyze intent
    needs_size_match = "fits me" in prompt_lower or "my size" in prompt_lower

    # Filtering fabrics based on simple keyword matches
    matched_fabrics = []

    # 1. Colors
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
    found_colors = [c for c in color_keywords if c in prompt_lower]

    # 2. Fabric Types/Materials
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
    found_types = [t for t in type_keywords if t in prompt_lower]

    for f in fabrics:
        f_name_lower = f.get("name", "").lower()
        f_type_lower = f.get("type", "").lower()
        f_color_lower = f.get("color", "").lower()

        # Check color match
        if found_colors and not any(
            c in f_name_lower or c in f_color_lower for c in found_colors
        ):
            continue

        # Check type match
        if found_types and not any(
            t in f_name_lower or t in f_type_lower for t in found_types
        ):
            continue

        # If passed filters, add it
        matched_fabrics.append(f)

    # 3. Calculate requirements if sizes are needed
    required_meters = 0
    message = "Here are some beautiful fabrics I found for you based on your request!"

    if needs_size_match:
        if user_measurements:
            # Simple heuristic: e.g. for a shirt, chest size (in cm)
            # * 0.02 + 0.5 additional meters
            chest = float(user_measurements.get("chest", 90))  # default 90cm
            waist = float(user_measurements.get("waist", 75))

            # Simple assumption:
            if (
                "shirt" in prompt_lower
                or "top" in prompt_lower
                or "dress" in prompt_lower
            ):
                required_meters = round(
                    chest * 0.025 + 0.5, 1
                )  # ex: 100cm chest -> 3.0 meters
            elif (
                "pant" in prompt_lower
                or "denim" in prompt_lower
                or "trouser" in prompt_lower
            ):
                required_meters = round(
                    waist * 0.025 + 0.8, 1
                )  # ex: 80cm waist -> 2.8 meters
            else:
                required_meters = 2.5  # default fallback

            message = (
                "Based on the measurements saved in your profile, you will need "
                f"approximately {required_meters} meters of fabric. "
                "Here are the best matches for you!"
            )
        else:
            message = (
                "I noticed you asked for something that fits you, but your profile "
                "doesn't have size charts updated yet. You can update your "
                "measurements in your profile settings. Here are your fabric matches "
                "in the meantime!"
            )

    # Fallback if no specific keywords found (or matched fabrics empty)
    if not matched_fabrics:
        if not found_colors and not found_types:
            # Just return top 5 fabrics
            matched_fabrics = fabrics[:5]
            message = (
                "I can help you find fabrics! Here are some of our popular picks. "
                "Try asking for specific colors or materials like 'white cotton' "
                "or 'blue denim'."
            )
        else:
            message = (
                "I couldn't find any exact matches for your request, but our "
                "inventory updates frequently! Try adjusting your search."
            )

    return {
        "message": message,
        "fabrics": matched_fabrics,
        "required_meters": required_meters,
    }


@router.post("/chat")
def chat_with_ai(request: ChatRequest):
    measurements = {}

    # 1. Fetch user measurements if userId exists
    if request.userId:
        user_doc = db.collection("users").document(request.userId).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            measurements = user_data.get("measurements", {})

    # 2. Fetch all active fabrics
    fabrics_ref = db.collection("fabrics").stream()
    fabrics = []
    for doc in fabrics_ref:
        f = doc.to_dict()
        f["id"] = doc.id
        if not f.get("hidden", False):
            fabrics.append(f)

    # 3. Process the AI intent
    response = process_ai_chat(request.prompt, measurements, fabrics)

    return response
