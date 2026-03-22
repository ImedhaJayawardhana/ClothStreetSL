import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage

if os.path.exists("serviceAccountKey.json"):
    cred = credentials.Certificate("serviceAccountKey.json")
elif os.environ.get("FIREBASE_CREDENTIALS"):
    cert_dict = json.loads(os.environ.get("FIREBASE_CREDENTIALS", "{}"))
    cred = credentials.Certificate(cert_dict)
else:
    # Fallback to default application credentials if none exist
    cred = credentials.ApplicationDefault()

firebase_admin.initialize_app(
    cred, {"storageBucket": "clothstreet-3a86c.firebasestorage.app"}
)

db = firestore.client()
bucket = storage.bucket()
