# server/app.py
import os
from flask import Flask, jsonify
from flask import Flask, jsonify,request,send_file
from flask_cors import CORS
from db import db
from auth import auth_bp  # must expose a Blueprint named auth_bp
from map import map_bp
from datetime import timedelta

app = Flask(__name__)

# Needed for Flask session cookies (used after login/signup)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret")

app.config["MEDIA_ROOT"] = os.getenv("MEDIA_ROOT", "/app/media")

app.config.update(
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",   # use "None" + SECURE=True if cross-site over HTTPS
    SESSION_COOKIE_SECURE=False,     # set True in production (HTTPS)
)

# CORS: allow the React client to send cookies (credentials)
CORS(
    app,
    supports_credentials=True,
    origins=os.getenv("CORS_ORIGINS", "http://localhost:8080").split(","),
)

ALLOWED_MIME = {"image/webp", "image/jpeg", "image/png"}


@app.route("/")
def hello_world():
    return "Hello, World!"


# @app.route('/api/map/send/<pin>',methods=['POST','GET'])
# def send_pin(pin):
#     if request.method == 'POST':
#         file_name = time.strftime("%Y%m%d-%H%M%S") + "-"+pin+".webp"
#         file = request.files['image']
#         file.save(os.path.abspath('/media/'+file_name))
#         print(file)
#         # with open(os.path.abspath(f'/media/'+file_name),'wb') as f:
#         #     f.write(file)
#         mydict = { "pin": pin, "name":file_name }
#         x= mycol.insert_one(mydict)

# @app.route('/api/map/get/<pin>')
# def get_photo(pin):
#     photo = db.photos.find_one({"pin":pin},sort={"name": pymongo.DESCENDING})
#     try:
#         return send_file('/media/'+photo["name"], mimetype="image/webp")
#     except Exception as e:
#         return str(e)


@app.route('/api/map/get',methods=['GET'])
def get_pin():
    pins = []
    for document in db.pins.find():
        pins.append({"pin":document["pin"],"loc":document["loc"]})
         # iterate the cursor
    print(pins)
    return {"pins":pins}


# --- Auth routes are provided by the blueprint ---
# If your blueprint defines @auth_bp.post("/auth/signup") and @auth_bp.post("/auth/login"),
# then mounting at url_prefix="/api" yields:
#   POST /api/auth/signup
#   POST /api/auth/login
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(map_bp,  url_prefix="/api") 

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5500, debug=True)
