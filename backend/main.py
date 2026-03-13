from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.users import router as users_router
from routers.tailors import router as tailors_router
from routers.fabrics import router as fabrics_router
from routers.quotations import router as quotations_router
from routers.designers import router as designers_router
from routers.orders import router as orders_router
from routers.storage import router as storage_router

app = FastAPI(
    title="ClothStreet API",
    description="Backend API for ClothStreetSL — a Sri Lankan fashion marketplace",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(tailors_router, prefix="/tailors", tags=["Tailors"])
app.include_router(fabrics_router, prefix="/fabrics", tags=["Fabrics"])
app.include_router(quotations_router, prefix="/quotations", tags=["Quotations"])
app.include_router(designers_router, prefix="/designers", tags=["Designers"])
app.include_router(orders_router, prefix="/orders", tags=["Orders"])
app.include_router(storage_router, prefix="/storage", tags=["Storage"])


@app.get("/")
def root():
    return {"message": "ClothStreetSL API is running"}
