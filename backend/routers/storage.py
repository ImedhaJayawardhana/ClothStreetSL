from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from firebase.admin import bucket
from firebase.auth_verify import verify_token

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_SIZE_MB = 5


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = "general",
    decoded_token: dict = Depends(verify_token),
):
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG, PNG, and WebP are allowed.",
        )

    # Read and validate file size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=400, detail=f"File too large. Maximum size is {MAX_SIZE_MB}MB."
        )

    # Upload to Firebase Storage
    uid = decoded_token["uid"]
    filename = f"{folder}/{uid}/{file.filename}"
    blob = bucket.blob(filename)
    blob.upload_from_string(contents, content_type=file.content_type)

    # Make the file publicly accessible
    blob.make_public()

    return {
        "message": "Image uploaded successfully",
        "url": blob.public_url,
        "filename": filename,
    }


@router.delete("/delete")
async def delete_image(
    filename: str,
    decoded_token: dict = Depends(verify_token),
):
    uid = decoded_token["uid"]

    # Make sure user can only delete their own files
    if uid not in filename:
        raise HTTPException(
            status_code=403, detail="You can only delete your own files"
        )

    blob = bucket.blob(filename)
    if not blob.exists():
        raise HTTPException(status_code=404, detail="File not found")

    blob.delete()
    return {"message": "Image deleted successfully"}
