from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel

class User(BaseModel):
    email: str
    name: str
    role: Literal["customer", "tailor", "designer", "seller"]

class TailorProfile(BaseModel):
    name: str
    skills: List[str]
    location: str
    price_range: str
    availability: bool

class TailorProfileUpdate(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    price_range: Optional[str] = None
    availability: Optional[bool] = None

class DesignerProfile(BaseModel):
    name: str
    style: str
    portfolio_url: Optional[str] = None
    price_range: str

class DesignerProfileUpdate(BaseModel):
    name: Optional[str] = None
    style: Optional[str] = None
    portfolio_url: Optional[str] = None
    price_range: Optional[str] = None

class Fabric(BaseModel):
    name: str
    type: str
    color: str
    price: float
    stock: int

class FabricUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    color: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None

class Quotation(BaseModel):
    tailor_id: str
    fabric_id: str
    description: str
    price: float

class QuotationStatusUpdate(BaseModel):
    status: Literal["pending", "accepted", "completed"]

class Order(BaseModel):
    items: List[dict]
    total_price: float
    status: Literal["pending", "processing", "completed", "cancelled"] = "pending"
    created_at: Optional[datetime] = None