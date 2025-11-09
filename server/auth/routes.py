# server/auth/routes.py
import re
from datetime import datetime
from flask import request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash

from . import auth_bp
from db import users

# Comment: server-side email rule to match your frontend (lowercase username + buffalo.edu)
EMAIL_RE = re.compile(r"^([a-z0-9]+)@buffalo\.edu$", re.IGNORECASE)

# Comment: require >=8 chars, at least one uppercase and one special char
UPPER_RE   = re.compile(r"[A-Z]")
SPECIAL_RE = re.compile(r"[!@#$%^&*()_\-+\=\[\]{};:'\",.<>/?\\|`~]")

def bad_request(message, code=400):
    return jsonify({"success": False, "error": message}), code  # Comment: unified error

@auth_bp.post("/auth/signup")
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "")
    confirm = (data.get("confirmPassword") or "")

    # match email and capture the local-part (username)
    m = EMAIL_RE.match(email)  # EMAIL_RE: r"^([a-z0-9]+)@buffalo\.edu$", re.IGNORECASE
    if not m:
        return bad_request("Use your @buffalo.edu email.")

    username = m.group(1).lower()  # username = portion before '@', enforced to lowercase/digits

    if password != confirm:
        return bad_request("Passwords do not match.")
    if len(password) < 8:
        return bad_request("Use at least 8 characters.")
    if not UPPER_RE.search(password):
        return bad_request("Include at least one uppercase letter.")
    if not SPECIAL_RE.search(password):
        return bad_request("Include at least one special character.")

    email_norm = email.lower()

    try:
        doc = {
            "email": email_norm,
            "username": username,                         # store derived username
            "password_hash": generate_password_hash(password),
            "created_at": datetime.utcnow(),
        }
        result = users.insert_one(doc)
    except Exception:
        return bad_request("Email already registered.")

    session["user_id"] = str(result.inserted_id)
    return jsonify({"success": True})


@auth_bp.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "")

    if not email or not password:
        return bad_request("Email and password are required.")

    user = users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        # Generic message to avoid leaking which part failed
        return bad_request("Invalid email or password.", code=401)

    session["user_id"] = str(user["_id"])                        # Comment: keep user logged in
    return jsonify({"success": True})
