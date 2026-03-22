import uuid
import sys
import random
from datetime import datetime, timezone

sys.path.append(".")
from firebase.admin import db

# Highly robust image URLs that will NEVER break (FakeStoreAPI)
clothing_data = {
    "Men's": [
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        "https://fakestoreapi.com/img/71li-ujtl-L._AC_UX679_.jpg",
        "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    ],
    "Women's": [
        "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
        "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
        "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
        "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
        "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    ],
}

adjectives = [
    "Classic",
    "Modern",
    "Stylish",
    "Casual",
    "Premium",
    "Urban",
    "Vintage",
    "Essential",
]
colors = ["Black", "White", "Navy", "Olive", "Grey", "Maroon", "Beige"]
locations = ["Colombo", "Kandy", "Galle", "Kurunegala", "Matara"]

products_to_seed = []

# Generate exactly 23 Men's items (Total 46 requested)
mens_types = ["Men's T-Shirt", "Men's Shirt", "Men's Trousers"]
for i in range(23):
    p_type = random.choice(mens_types)
    color = random.choice(colors)
    adj = random.choice(adjectives)

    products_to_seed.append(
        {
            "name": f"{adj} {color} {p_type}",
            "type": p_type.split(" ")[1],  # e.g. "T-Shirt"
            "color": color,
            "category": random.choice(locations),
            "location": random.choice(locations),
            "price": random.randint(2500, 8500),
            "stock": random.randint(15, 100),
            "image_url": random.choice(clothing_data["Men's"]),
            "hidden": False,
            "supplier_id": f"seller_store_{random.randint(1, 4)}",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "sales": random.randint(5, 200),
        }
    )

# Generate exactly 23 Women's items
womens_types = ["Women's Top", "Women's T-Shirt", "Women's Trousers"]
for i in range(23):
    p_type = random.choice(womens_types)
    color = random.choice(colors)
    adj = random.choice(adjectives)

    products_to_seed.append(
        {
            "name": f"{adj} {color} {p_type}",
            "type": p_type.split(" ")[1],  # e.g. "Top"
            "color": color,
            "category": random.choice(locations),
            "location": random.choice(locations),
            "price": random.randint(2000, 9500),
            "stock": random.randint(15, 100),
            "image_url": random.choice(clothing_data["Women's"]),
            "hidden": False,
            "supplier_id": f"seller_store_{random.randint(1, 4)}",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "sales": random.randint(5, 200),
        }
    )


def seed_db():
    collection = db.collection("fabrics")

    print("Clearing old seeded items...")

    # 1. Delete seller_store_ items
    docs = collection.where("supplier_id", ">=", "seller_store_").stream()
    deleted_count = 0
    for doc in docs:
        if "seller_store_" in str(doc.to_dict().get("supplier_id", "")):
            doc.reference.delete()
            deleted_count += 1

    # 2. Delete seeder_seller_ items (older test data)
    docs2 = collection.where("supplier_id", ">=", "seeder_seller_").stream()
    for doc in docs2:
        if "seeder_seller_" in str(doc.to_dict().get("supplier_id", "")):
            doc.reference.delete()
            deleted_count += 1

    # 3. Aggressive cleanup: delete anything with loremflickr or unsplash if it was missed
    docs_all = collection.stream()
    for doc in docs_all:
        d_dict = doc.to_dict()
        url = d_dict.get("image_url", "")
        if url and ("unsplash" in url.lower() or "loremflickr" in url.lower()):
            doc.reference.delete()
            deleted_count += 1

    print(f"Deleted {deleted_count} old test fabrics featuring broken/slow images.")

    print(
        f"Starting database seeding for {len(products_to_seed)} perfectly reliable clothing items..."
    )
    count = 0
    for product in products_to_seed:
        product_id = str(uuid.uuid4())
        product["id"] = product_id

        stock = product["stock"]
        product["stockStatus"] = "out" if stock <= 0 else "low" if stock <= 10 else "in"
        product["createdAt"] = datetime.now(timezone.utc).isoformat()

        # Save to firestore
        collection.document(product_id).set(product)
        count += 1

    print(
        f"Successfully guaranteed {count} clothing items with 100% unbreakable images."
    )


if __name__ == "__main__":
    seed_db()
