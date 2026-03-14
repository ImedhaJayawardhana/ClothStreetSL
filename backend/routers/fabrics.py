from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Optional, List
from datetime import datetime, timezone
import uuid

from firebase.admin import db

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────


class FabricCreate(BaseModel):
    name: str
    type: Optional[str] = ""
    color: Optional[str] = ""  # e.g. "Blue", "Multi-color"
    category: Optional[str] = ""  # location e.g. "Colombo"
    price: Optional[float] = 0
    stock: Optional[float] = 0
    colors: Optional[List[str]] = []  # hex color swatches
    image_url: Optional[str] = None  # image URL
    hidden: Optional[bool] = False
    supplier_id: Optional[str] = None  # Firebase user uid of seller


class FabricUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[float] = None
    colors: Optional[List[str]] = None
    image_url: Optional[str] = None
    hidden: Optional[bool] = None
    supplier_id: Optional[str] = None


# ── Helper: derive stockStatus from stock number ──────────────
def get_stock_status(stock: float) -> str:
    if stock <= 0:
        return "out"
    if stock <= 10:
        return "low"
    return "in"


# ── GET all fabrics ───────────────────────────────────────────
@router.get("/")
def list_fabrics():
    docs = db.collection("fabrics").stream()
    fabrics = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        # Auto-derive stockStatus if missing
        if "stockStatus" not in data:
            data["stockStatus"] = get_stock_status(data.get("stock", 0))
        fabrics.append(data)
    return fabrics


# ── GET single fabric ─────────────────────────────────────────
@router.get("/{fabric_id}")
def get_fabric(fabric_id: str):
    doc = db.collection("fabrics").document(fabric_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Fabric not found")
    data = doc.to_dict()
    data["id"] = doc.id
    if "stockStatus" not in data:
        data["stockStatus"] = get_stock_status(data.get("stock", 0))
    return data


# ── POST create fabric ────────────────────────────────────────
@router.post("/")
def create_fabric(fabric: FabricCreate):
    fabric_id = str(uuid.uuid4())
    stock = fabric.stock or 0
    new_fabric = {
        "id": fabric_id,
        "name": fabric.name,
        "type": fabric.type,
        "color": fabric.color,
        "category": fabric.category,
        "location": fabric.category,  # BrowseMaterials uses "location"
        "price": fabric.price,
        "stock": stock,
        "stockStatus": get_stock_status(stock),
        "colors": fabric.colors,
        "image_url": fabric.image_url,
        "hidden": fabric.hidden,
        "supplier_id": fabric.supplier_id,
        "rating": 5.0,
        "sales": 0,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    db.collection("fabrics").document(fabric_id).set(new_fabric)
    return {"fabric_id": fabric_id, **new_fabric}


# ── PATCH update fabric ───────────────────────────────────────
@router.patch("/{fabric_id}")
def update_fabric(fabric_id: str, fabric: FabricUpdate):
    doc_ref = db.collection("fabrics").document(fabric_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Fabric not found")

    # Only update fields that were actually sent (not None)
    updates: dict[str, Any] = {
        k: v for k, v in fabric.model_dump().items() if v is not None
    }

    # Keep location in sync with category
    if "category" in updates:
        updates["location"] = updates["category"]

    # Auto-derive stockStatus when stock is updated
    if "stock" in updates:
        updates["stockStatus"] = get_stock_status(updates["stock"])

    updates["updatedAt"] = datetime.now(timezone.utc).isoformat()

    doc_ref.update(updates)

    updated = doc_ref.get().to_dict()
    updated["id"] = fabric_id
    return updated


# ── DELETE fabric ─────────────────────────────────────────────
@router.delete("/{fabric_id}")
def delete_fabric(fabric_id: str):
    doc = db.collection("fabrics").document(fabric_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Fabric not found")
    db.collection("fabrics").document(fabric_id).delete()
    return {"message": "Fabric deleted successfully", "id": fabric_id}
