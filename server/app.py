from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/check-connection')
def check():
    return jsonify({"message": "✅ connected!"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5500, debug=True)