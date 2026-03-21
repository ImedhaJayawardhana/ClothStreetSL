import sys
import re
import uuid
import random
from datetime import datetime, timezone

sys.path.append(".")
from firebase.admin import db
import requests
from bs4 import BeautifulSoup

def get_shopify_images(url):
    """Generic parser for Shopify-based stores (Mimosa, Zigzag, Moose)"""
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    images = []
    try:
        r = requests.get(url, headers=headers, timeout=10)
        # Match standard shopify cdn links
        matches1 = re.findall(r'(//cdn\.shopify\.com/s/files/[^\s\"\'\?]+\.(?:jpg|png|webp))', r.text)
        # Match custom domain shopify cdn links
        domain = url.split("//")[1].split("/")[0]
        matches2 = re.findall(rf'(//{domain}/cdn/shop/files/[^\s\"\'\?]+\.(?:jpg|png|webp))', r.text)
        
        for m in matches1 + matches2:
            # exclude tiny thumbnails or favicons
            if "favicon" not in m.lower() and "icon" not in m.lower():
                images.append("https:" + m)
    except Exception as e:
        print(f"Shopify scrape error for {url}:", e)
        
    return list(set(images))

def get_nolimit_images():
    """Parser for Nolimit (Next.js based)"""
    url = "https://www.nolimit.lk/categories/Men/Casual-Wear"
    headers = {"User-Agent": "Mozilla/5.0"}
    images = []
    try:
        r = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(r.text, 'html.parser')
        for img in soup.find_all('img'):
            src = img.get('src') or ''
            if 'product' in src.lower() and ('jpg' in src.lower() or 'png' in src.lower() or 'webp' in src.lower()):
                if src.startswith('//'): src = 'https:' + src
                elif src.startswith('/'): src = 'https://www.nolimit.lk' + src
                if 'url=' in src:
                    parsed = src.split('url=')[1].split('&')[0]
                    import urllib.parse
                    src = urllib.parse.unquote(parsed)
                images.append(src)
    except Exception as e:
        pass
    return list(set(images))

def seed_db():
    print("Scraping multiple famous stores...")
    
    # Men's
    nolimit_imgs = get_nolimit_images()
    moose_imgs = get_shopify_images("https://mooseclothingcompany.com/collections/mens-t-shirts")
    mens_pool = nolimit_imgs + moose_imgs
    
    # Women's
    mimosa_imgs = get_shopify_images("https://mimosaforever.com/collections/skirts")
    zigzag_imgs = get_shopify_images("https://www.zigzag.lk/collections/womens-clothing")
    womens_pool = mimosa_imgs + zigzag_imgs
    
    # Fallbacks just in case
    if not mens_pool:
        mens_pool = ["https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"]
    if not womens_pool:
        womens_pool = ["https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"]

    print(f"Harvested {len(mens_pool)} unique Men's images.")
    print(f"Harvested {len(womens_pool)} unique Women's images.")
    
    adjectives = ["Classic", "Modern", "Stylish", "Casual", "Premium", "Urban", "Signature", "Essential"]
    colors = ["Black", "White", "Navy", "Olive", "Grey", "Maroon", "Beige", "Denim"]
    locations = ["Colombo", "Kandy", "Galle", "Kurunegala", "Matara", "Mount Lavinia"]
    products_to_seed = []

    # Generate 40 Men's items (From Nolimit & Moose)
    for i in range(40):
        color = random.choice(colors)
        adj = random.choice(adjectives)
        p_type = random.choice(["T-Shirt", "Shirt", "Trousers", "Polo"])
        
        products_to_seed.append({
            "name": f"{adj} {color} Men's {p_type}",
            "type": p_type,
            "color": color,
            "category": random.choice(locations),
            "location": random.choice(locations),
            "price": random.randint(2500, 8500),
            "stock": random.randint(15, 100),
            "image_url": random.choice(mens_pool),
            "hidden": False,
            "supplier_id": f"seller_store_{random.randint(1, 10)}",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "sales": random.randint(5, 500),
        })

    # Generate 40 Women's items (From Mimosa & Zigzag)
    for i in range(40):
        color = random.choice(colors)
        adj = random.choice(adjectives)
        p_type = random.choice(["Skirt", "Dress", "Blouse", "Top", "Jeans"])
        
        products_to_seed.append({
            "name": f"{adj} {color} Women's {p_type}",
            "type": p_type,
            "color": color,
            "category": random.choice(locations),
            "location": random.choice(locations),
            "price": random.randint(2000, 9500),
            "stock": random.randint(15, 100),
            "image_url": random.choice(womens_pool),
            "hidden": False,
            "supplier_id": f"seller_store_{random.randint(1, 10)}",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "sales": random.randint(5, 500),
        })

    collection = db.collection("fabrics")
    
    print("Clearing old seeded items...")
    docs_all = collection.stream()
    deleted = 0
    for doc in docs_all:
        d_dict = doc.to_dict()
        sid = str(d_dict.get("supplier_id", ""))
        # Delete items seeded by us
        if "seller_store_" in sid or "seller_nolimit" in sid or "seller_mimosa" in sid or "seeder" in sid:
            doc.reference.delete()
            deleted += 1

    print(f"Deleted {deleted} old items. Inserting {len(products_to_seed)} massive catalog updates...")

    count = 0
    for product in products_to_seed:
        product_id = str(uuid.uuid4())
        product["id"] = product_id
        
        stock = product["stock"]
        product["stockStatus"] = "out" if stock <= 0 else "low" if stock <= 10 else "in"
        product["createdAt"] = datetime.now(timezone.utc).isoformat()
        
        collection.document(product_id).set(product)
        count += 1
        
    print(f"Successfully guaranteed {count} clothing items harvested from Sri Lanka's top platforms.")

if __name__ == "__main__":
    seed_db()
