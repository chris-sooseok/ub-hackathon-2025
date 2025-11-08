from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/check-connection')
def check():
    return jsonify({"message": "✅ connected!"})

@app.route('/map/send/<pin>')
def send_pin(pin):
    return jsonify({"message": "pin info received"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5500, debug=True)