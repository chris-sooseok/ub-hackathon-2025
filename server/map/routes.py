# server/map/routes.py
import os
from datetime import datetime
from flask import current_app, jsonify, request, send_from_directory, session
from werkzeug.utils import secure_filename
from bson import ObjectId
from . import map_bp
from db import pins
from functools import wraps

# Accept only common image types
ALLOWED_MIME = {"image/webp", "image/jpeg", "image/png"}

def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not session.get("user_id"):              # must be logged in
            return jsonify({"success": False, "error": "not authenticated"}), 401
        return fn(*args, **kwargs)
    return wrapper

def _ensure_media_dir():
  """Create media folder inside the Flask app root, if missing."""
  media_root = os.path.join(current_app.root_path, "media")
  os.makedirs(media_root, exist_ok=True)         # creates folder if not present
  return media_root

def _media_root():
    # If you already have _ensure_media_dir(), you can reuse that instead.
    root = os.path.join(current_app.root_path, "media")
    os.makedirs(root, exist_ok=True)
    return root

@map_bp.post("/map/create-marker")
@require_auth
def create_marker():
  """
  Expects multipart/form-data:
    - image: file blob
    - lat: float
    - lng: float
  (Optionally you can also pass 'pin' like '43.00010_-78.78650' and parse it)
  """
  img = request.files.get("image")
  lat = request.form.get("lat", type=float)
  lng = request.form.get("lng", type=float)

  if img is None:
    return jsonify({"success": False, "error": "image is required"}), 400

  if img.mimetype not in ALLOWED_MIME:
    return jsonify({"success": False, "error": f"unsupported content-type: {img.mimetype}"}), 400

  media_root = _ensure_media_dir()

  # Create a new pin id and choose extension from mimetype
  obj_id = ObjectId()                                # Mongo ObjectId
  pin_id = str(obj_id)                               # for JSON response
  ext = { "image/webp": ".webp", "image/jpeg": ".jpg", "image/png": ".png" }.get(img.mimetype, ".bin")

  # Save image as <pin_id>.<ext> to avoid relying on client filename
  filename = secure_filename(f"{pin_id}{ext}")       # sanitizes filename
  save_path = os.path.join(media_root, filename)
  img.save(save_path)                                # writes file to disk

  # Path the client can use; because the blueprint is mounted at /api,
  # the media route below will be /api/media/<filename>
  image_path = f"/api/media/{filename}"

  # Insert pin doc
  doc = {
    "_id": obj_id,
    "lat": lat,
    "lng": lng,
    "image_path": image_path,
    "created_at": datetime.utcnow(),
  }
  pins.insert_one(doc)

  return jsonify({
    "success": True,
    "pin": { "id": pin_id, "lat": lat, "lng": lng, "image_path": image_path }
  }), 201


@map_bp.get("/map/fetch-pins")
def fetch_pins():
    """
    Returns all pins. Optional ?limit=NN query param.
    Each item: {id, lat, lng, image_path, created_at}
    """
    limit = request.args.get("limit", type=int)

    q = pins.find(
        {}, 
        {"lat": 1, "lng": 1, "image_path": 1, "created_at": 1}
    ).sort("created_at", -1)

    if limit:
        q = q.limit(limit)

    out = []
    for doc in q:
        out.append({
            "id": str(doc["_id"]),
            "lat": float(doc.get("lat", 0.0)),
            "lng": float(doc.get("lng", 0.0)),
            "image_path": doc.get("image_path", ""),
            # ISO string for client display (omit if None)
            "created_at": doc["created_at"].isoformat() + "Z" if isinstance(doc.get("created_at"), datetime) else None,
        })

    return jsonify(out)


@map_bp.get("/map/fetch-image")
def fetch_image():
    """
    GET /api/map/fetch-image?id=<pin_id>
    Returns the image bytes for a given pin.
    """
    pin_id = request.args.get("id")
    if not pin_id:
        return jsonify({"error": "missing id"}), 400

    try:
        oid = ObjectId(pin_id)
    except Exception:
        return jsonify({"error": "invalid id"}), 400

    doc = pins.find_one({"_id": oid}, {"image_path": 1})
    if not doc or not doc.get("image_path"):
        return jsonify({"error": "not found"}), 404

    # image_path was stored like "/api/media/<filename>"
    filename = os.path.basename(doc["image_path"])
    if not filename:
        return jsonify({"error": "not found"}), 404

    media_root = _media_root()
    filepath = os.path.join(media_root, filename)
    if not os.path.isfile(filepath):
        return jsonify({"error": "file missing"}), 404

    resp = send_from_directory(media_root, filename)
    # Lightweight caching (1 week); tweak as you like
    resp.headers["Cache-Control"] = "public, max-age=604800"
    return resp
