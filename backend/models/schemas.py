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
    experience: Optional[int] = 0
    rating: Optional[float] = 5.0
    availability: Optional[bool] = True


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
    experience: Optional[int] = None
    rating: Optional[float] = None
    availability: Optional[bool] = None


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
    providerId: str
    providerName: Optional[str] = None
    providerType: Optional[str] = None
    serviceType: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    deadline: Optional[str] = None
    referenceImageUrl: Optional[str] = None
    requirements: Optional[str] = None
    gender: Optional[str] = None
    expectedDate: Optional[str] = None
    items: Optional[List[dict]] = []
    measurements: Optional[dict] = {}
    designImages: Optional[List[str]] = []
    customerName: Optional[str] = None
    customerEmail: Optional[str] = None


class QuotationUpdate(BaseModel):
    status: Optional[
        Literal["pending", "quoted", "accepted", "rejected", "declined"]
    ] = None
    providerResponse: Optional[str] = None
    proposedPrice: Optional[float] = None
    laborCharge: Optional[float] = None
    additionalCharges: Optional[float] = None
    additionalNote: Optional[str] = None
    completionDate: Optional[str] = None
    providerRemarks: Optional[str] = None
    grandTotal: Optional[float] = None
    paymentMethod: Optional[str] = None


class QuotationStatusUpdate(BaseModel):
    status: Literal["pending", "quoted", "accepted", "rejected", "declined"]


class Order(BaseModel):
    items: List[dict]
    total_price: float
    status: Literal["pending", "processing", "completed", "cancelled"] = "pending"
    created_at: Optional[datetime] = None
