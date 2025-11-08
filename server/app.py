from flask import Flask, jsonify
from flask_cors import CORS
from db import db, check_indexes

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/check-connection')
def check():
    return jsonify({"message": "✅ connected!"})

@app.route('/api/map/send/<pin>')
def send_pin(pin):
    return jsonify({"message": "pin info received"})

@app.route("/api/db/ping")
def db_ping():
    #ping mongo at start, raises if not connected
    #for sanity check run: http://localhost:5500/api/db/ping
    db.client.admin.command("ping")
    return jsonify({"ok": True, "db": db.name, "collections": sorted(db.list_collection_names())})

if __name__ == '__main__':
    check_indexes()
    app.run(host="0.0.0.0", port=5500, debug=True)