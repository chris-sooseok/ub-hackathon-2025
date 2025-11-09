# server/app.py
import os
from flask import Flask, jsonify
from flask_cors import CORS
from db import db
from auth import auth_bp  # must expose a Blueprint named auth_bp

app = Flask(__name__)

# Needed for Flask session cookies (used after login/signup)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret")

# CORS: allow the React client to send cookies (credentials)
CORS(
    app,
    supports_credentials=True,                                  # allow cookies
    origins=os.getenv("CORS_ORIGINS", "http://localhost:8080").split(","),
)

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route("/api/check-connection")
def check():
    return jsonify({"message": "✅ connected!"})

@app.route("/api/db/ping")
def db_ping():
    # ping mongo at start, raises if not connected
    # sanity check: http://localhost:5500/api/db/ping
    db.client.admin.command("ping")
    return jsonify({"ok": True, "db": db.name, "collections": sorted(db.list_collection_names())})

# --- Auth routes are provided by the blueprint ---
# If your blueprint defines @auth_bp.post("/auth/signup") and @auth_bp.post("/auth/login"),
# then mounting at url_prefix="/api" yields:
#   POST /api/auth/signup
#   POST /api/auth/login
app.register_blueprint(auth_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5500, debug=True)
