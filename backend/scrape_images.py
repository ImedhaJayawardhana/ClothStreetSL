import sys
import subprocess

try:
    import bs4
except ImportError:
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "beautifulsoup4", "requests"]
    )
    import bs4

import requests
from bs4 import BeautifulSoup


def scrape_nolimit():
    url = "https://www.nolimit.lk/categories/Men/Casual-Wear"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        images = []
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src") or ""
            if src and (
                "product" in src.lower()
                or "catalog" in src.lower()
                or ".jpg" in src.lower()
            ):
                if src.startswith("//"):
                    src = "https:" + src
                elif src.startswith("/"):
                    src = "https://www.nolimit.lk" + src
                images.append(src)
        print(f"Nolimit images found: {list(set(images))[:10]}")
    except Exception as e:
        print("Nolimit error:", e)


def scrape_mimosa():
    url = "https://mimosaforever.com/collections/skirts"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        images = []
        for img in soup.find_all("img"):
            # Shopify usually uses srcset or src
            src = img.get("data-src") or img.get("src") or ""
            src = src.split(",")[0].split(" ")[0]  # if srcset
            if src and ("products" in src.lower() or "cdn.shopify.com" in src.lower()):
                if src.startswith("//"):
                    src = "https:" + src
                if (
                    ".jpg" in src.lower()
                    or ".png" in src.lower()
                    or ".webp" in src.lower()
                ):
                    images.append(src)
        print(f"Mimosa images found: {list(set(images))[:10]}")
    except Exception as e:
        print("Mimosa error:", e)


if __name__ == "__main__":
    scrape_nolimit()
    scrape_mimosa()
