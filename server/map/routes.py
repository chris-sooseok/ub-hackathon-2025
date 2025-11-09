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
  ok = pins.insert_one(doc)
  print(ok)

  return jsonify({
    "success": True,
    "pin": { "id": pin_id, "lat": lat, "lng": lng, "image_path": image_path }
  }), 201

# Optional: serve media back
@map_bp.get("/media/<path:filename>")
def get_media(filename):
  media_root = _ensure_media_dir()
  return send_from_directory(media_root, filename)
