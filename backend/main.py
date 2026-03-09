from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.users import router as users_router
from routers.tailors import router as tailors_router
from routers.fabrics import router as fabrics_router
from routers.quotations import router as quotations_router

app = FastAPI(
    title="ClothStreet API",
    description="Backend API for ClothStreetSL — a Sri Lankan fashion marketplace",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(tailors_router, prefix="/tailors", tags=["Tailors"])
app.include_router(fabrics_router, prefix="/fabrics", tags=["Fabrics"])
app.include_router(quotations_router, prefix="/quotations", tags=["Quotations"])


@app.get("/")
def root():
    return {"message": "ClothStreetSL API is running"}