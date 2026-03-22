import uuid
import sys
import random
from datetime import datetime, timezone

sys.path.append(".")
from firebase.admin import db

types_men = ["Cotton", "Wool", "Linen", "Denim", "Corduroy", "Flannel"]
types_women = ["Silk", "Chiffon", "Georgette", "Lace", "Satin", "Velvet", "Crepe"]

colors = [
    "White",
    "Black",
    "Blue",
    "Red",
    "Green",
    "Yellow",
    "Pink",
    "Purple",
    "Brown",
    "Grey",
]
hex_colors = {
    "White": ["#FFFFFF", "#F5F5F5"],
    "Black": ["#000000", "#1C1C1C"],
    "Blue": ["#0000FF", "#000080"],
    "Red": ["#FF0000", "#8B0000"],
    "Green": ["#008000", "#2E8B57"],
    "Yellow": ["#FFFF00", "#FFD700"],
    "Pink": ["#FFC0CB", "#FF69B4"],
    "Purple": ["#800080", "#E6E6FA"],
    "Brown": ["#A52A2A", "#D2B48C"],
    "Grey": ["#808080", "#C0C0C0"],
}
locations = ["Colombo", "Kandy", "Galle", "Kurunegala", "Matara"]

fabrics_to_seed = []

# Generate 25 Men's fabrics
for i in range(1, 26):
    f_type = random.choice(types_men)
    f_color = random.choice(colors)
    adjs = ["Premium", "Classic", "Vintage", "Modern", "Essential", "Luxury"]

    fabrics_to_seed.append(
        {
            "name": f"{random.choice(adjs)} Men's {f_color} {f_type}",
            "type": f_type,
            "color": f_color,
            "category": random.choice(locations),
            "price": random.randint(1500, 8000),
            "stock": random.randint(10, 200),
            "colors": hex_colors[f_color],
            "image_url": f"https://loremflickr.com/800/800/fabric,textile?lock={i}",
            "hidden": False,
            "supplier_id": f"seeder_seller_{random.randint(1, 4)}",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "sales": random.randint(0, 150),
        }
    )

# Generate 25 Women's fabrics
for i in range(26, 51):
    f_type = random.choice(types_women)
    f_color = random.choice(colors)
    adjs = ["Elegant", "Vibrant", "Soft", "Bridal", "Evening", "Designer"]

    fabrics_to_seed.append(
        {
            "name": f"{random.choice(adjs)} Women's {f_color} {f_type}",
            "type": f_type,
            "color": f_color,
            "category": random.choice(locations),
            "price": random.randint(1800, 12000),
            "stock": random.randint(10, 200),
            "colors": hex_colors[f_color],
            "image_url": f"https://loremflickr.com/800/800/fabric,textile?lock={i}",
            "hidden": False,
            "supplier_id": f"seeder_seller_{random.randint(1, 4)}",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "sales": random.randint(0, 150),
        }
    )


def seed_db():
    print(f"Starting database seeding for {len(fabrics_to_seed)} fabrics...")
    collection = db.collection("fabrics")

    count = 0
    for fabric in fabrics_to_seed:
        fabric_id = str(uuid.uuid4())
        fabric["id"] = fabric_id

        # Derive stockStatus manually just in case
        stock = fabric["stock"]
        fabric["stockStatus"] = "out" if stock <= 0 else "low" if stock <= 10 else "in"
        fabric["location"] = fabric["category"]
        fabric["createdAt"] = datetime.now(timezone.utc).isoformat()

        # Save to firestore
        collection.document(fabric_id).set(fabric)
        count += 1

    print(f"Successfully guaranteed {count} fabrics with working images.")


if __name__ == "__main__":
    seed_db()
