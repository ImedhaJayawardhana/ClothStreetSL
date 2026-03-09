import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from firebase.admin import db

USERS = [
    {
        "uid": "user_001",
        "email": "kamal@example.com",
        "name": "Kamal Perera",
        "role": "customer",
    },
    {
        "uid": "user_002",
        "email": "nimali@example.com",
        "name": "Nimali Silva",
        "role": "tailor",
    },
    {
        "uid": "user_003",
        "email": "ruwan@example.com",
        "name": "Ruwan Fernando",
        "role": "designer",
    },
    {
        "uid": "user_004",
        "email": "sandya@example.com",
        "name": "Sandya Jayawardena",
        "role": "seller",
    },
    {
        "uid": "user_005",
        "email": "dilshan@example.com",
        "name": "Dilshan Bandara",
        "role": "customer",
    },
]

TAILORS = [
    {
        "uid": "user_002",
        "name": "Nimali Silva",
        "skills": ["saree draping", "blouse stitching", "batik work"],
        "location": "Colombo",
        "price_range": "LKR 2000 - 8000",
        "availability": True,
    },
    {
        "uid": "tailor_002",
        "name": "Priya Rathnayake",
        "skills": ["traditional kandyan", "lehenga", "embroidery"],
        "location": "Kandy",
        "price_range": "LKR 3000 - 12000",
        "availability": True,
    },
    {
        "uid": "tailor_003",
        "name": "Chaminda Weerasinghe",
        "skills": ["men's suits", "shirts", "batik printing"],
        "location": "Galle",
        "price_range": "LKR 1500 - 6000",
        "availability": False,
    },
    {
        "uid": "tailor_004",
        "name": "Manel Dissanayake",
        "skills": ["saree draping", "osariya", "hand embroidery"],
        "location": "Matara",
        "price_range": "LKR 2500 - 9000",
        "availability": True,
    },
]

DESIGNERS = [
    {
        "uid": "user_003",
        "name": "Ruwan Fernando",
        "style": "modern fusion",
        "portfolio_url": "https://ruwan.design",
        "price_range": "LKR 10000 - 50000",
    },
    {
        "uid": "designer_002",
        "name": "Ishara Wickramasinghe",
        "style": "traditional",
        "portfolio_url": None,
        "price_range": "LKR 8000 - 30000",
    },
    {
        "uid": "designer_003",
        "name": "Thilini Abeysekara",
        "style": "minimalist",
        "portfolio_url": "https://thilini.lk",
        "price_range": "LKR 15000 - 60000",
    },
]

FABRICS = [
    {
        "name": "Colombo Batik Print",
        "type": "batik",
        "color": "blue and white",
        "price": 850.0,
        "stock": 50,
        "supplier_id": "user_004",
    },
    {
        "name": "Kandy Silk",
        "type": "silk",
        "color": "gold",
        "price": 3500.0,
        "stock": 20,
        "supplier_id": "user_004",
    },
    {
        "name": "Ceylon Cotton",
        "type": "cotton",
        "color": "white",
        "price": 500.0,
        "stock": 100,
        "supplier_id": "user_004",
    },
    {
        "name": "Handloom Linen",
        "type": "linen",
        "color": "beige",
        "price": 1200.0,
        "stock": 35,
        "supplier_id": "user_004",
    },
    {
        "name": "Galle Batik Sarong",
        "type": "batik",
        "color": "red and black",
        "price": 650.0,
        "stock": 60,
        "supplier_id": "user_004",
    },
    {
        "name": "Traditional Osariya Silk",
        "type": "silk",
        "color": "purple",
        "price": 4800.0,
        "stock": 15,
        "supplier_id": "user_004",
    },
]

QUOTATIONS = [
    {
        "customer_id": "user_001",
        "tailor_id": "user_002",
        "fabric_id": "fabric_001",
        "description": "Blouse stitching for Kandyan saree",
        "status": "pending",
        "price": 3500.0,
    },
    {
        "customer_id": "user_005",
        "tailor_id": "tailor_002",
        "fabric_id": "fabric_002",
        "description": "Traditional lehenga for wedding",
        "status": "accepted",
        "price": 8000.0,
    },
    {
        "customer_id": "user_001",
        "tailor_id": "tailor_003",
        "fabric_id": "fabric_003",
        "description": "Two casual shirts for office",
        "status": "completed",
        "price": 2500.0,
    },
]


def clear_collection(name):
    for doc in db.collection(name).stream():
        doc.reference.delete()
    print(f"  Cleared {name}")


def seed_with_uid(name, items):
    for item in items:
        db.collection(name).document(item["uid"]).set(item)
    print(f"  Seeded {len(items)} into {name}")


def seed_auto_id(name, items):
    for item in items:
        db.collection(name).add(item)
    print(f"  Seeded {len(items)} into {name}")


if __name__ == "__main__":
    print("Seeding Firestore...")
    for col in ["users", "tailors", "designers", "fabrics", "quotations"]:
        clear_collection(col)
    seed_with_uid("users", USERS)
    seed_with_uid("tailors", TAILORS)
    seed_with_uid("designers", DESIGNERS)
    seed_auto_id("fabrics", FABRICS)
    seed_auto_id("quotations", QUOTATIONS)
    print("Done! Firestore seeded successfully!")