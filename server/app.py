import os
from flask import Flask
from flask_cors import CORS
from db import db
from auth import auth_bp  # must expose a Blueprint named auth_bp
from map import map_bp
from datetime import timedelta

app = Flask(__name__)

app.secret_key = os.environ["SECRET_KEY"]

# directory where image uploads are stored
app.config["MEDIA_ROOT"] = os.getenv("MEDIA_ROOT", "/app/media")
app.config["MAX_CONTENT_LENGTH"] = int(
    os.getenv("MAX_CONTENT_LENGTH", str(10 * 1024 * 1024))
)

# Needed for Flask session cookies (used after login/signup)
app.config.update(
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",   # use "None" + SECURE=True if cross-site over HTTPS
    SESSION_COOKIE_SECURE=True     # set True in production (HTTPS)
)

# CORS: allow the React client to send cookies (credentials)
CORS(
    app,
    supports_credentials=True,
    origins=os.getenv("CORS_ORIGINS", "http://localhost:8080").split(","),
)

@app.get("/api/health")
def health():
    try:
        db.command("ping")
    except Exception:
        return {"status": "unhealthy"}, 503
    return {"status": "ok"}

# Serve map data
@app.route('/api/map/get',methods=['GET'])
def get_pin():
    pins = []
    for document in db.pins.find():
        pins.append({"pin":document["pin"],"loc":document["loc"]})
    return {"pins":pins}

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(map_bp,  url_prefix="/api") 

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5500, debug=False)
