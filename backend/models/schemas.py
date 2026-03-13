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
    bio: Optional[str] = None
    startingPrice: Optional[int] = 0
    services: Optional[List[str]] = []
    customizationTypes: Optional[List[str]] = []
    portfolioImages: Optional[List[str]] = []
    profilePhoto: Optional[str] = None
    phoneNumber: Optional[str] = None
    experience: Optional[int] = 0
    rating: Optional[float] = 4.5

class TailorProfileUpdate(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    price_range: Optional[str] = None
    availability: Optional[bool] = None
    bio: Optional[str] = None
    startingPrice: Optional[int] = None
    services: Optional[List[str]] = None
    customizationTypes: Optional[List[str]] = None
    portfolioImages: Optional[List[str]] = None
    profilePhoto: Optional[str] = None
    phoneNumber: Optional[str] = None
    experience: Optional[int] = None
    rating: Optional[float] = None

class DesignerProfile(BaseModel):
    name: str
    style: str
    portfolio_url: Optional[str] = None
    price_range: str
    location: Optional[str] = "Sri Lanka"
    bio: Optional[str] = None
    profilePhoto: Optional[str] = None
    hourlyRate: Optional[int] = 0
    services: Optional[List[str]] = []
    aesthetics: Optional[List[str]] = []
    portfolioImages: Optional[List[str]] = []
    phoneNumber: Optional[str] = None

class DesignerProfileUpdate(BaseModel):
    name: Optional[str] = None
    style: Optional[str] = None
    portfolio_url: Optional[str] = None
    price_range: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    profilePhoto: Optional[str] = None
    hourlyRate: Optional[int] = None
    services: Optional[List[str]] = None
    aesthetics: Optional[List[str]] = None
    portfolioImages: Optional[List[str]] = None
    phoneNumber: Optional[str] = None

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