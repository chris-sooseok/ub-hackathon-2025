import os
from pymongo import MongoClient, ASCENDING, DESCENDING

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME   = os.getenv("MONGO_DOCUMENT", "vendme-db")

client = MongoClient(MONGO_URL, tz_aware=True)

db = client[DB_NAME]

