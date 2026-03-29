import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME   = os.getenv("MONGO_DOCUMENT", "vendme-db")

client = MongoClient(MONGO_URL, tz_aware=True)

db = client[DB_NAME]

users = db["users"]
pins = db["pins"]
