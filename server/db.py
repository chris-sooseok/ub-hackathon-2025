import os
from pymongo import MongoClient, ASCENDING, DESCENDING

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME   = os.getenv("MONGO_DOCUMENT", "vendme-db")

client = MongoClient(MONGO_URL, tz_aware=True)

db = client[DB_NAME]

#index creation for optimised queries
def check_indexes():
    #creating users index
    db.users.create_index([("email", ASCENDING)], unique=True, name="uniq_email")
    db.users.create_index([("username", ASCENDING)], unique=True, name="uniq_username", sparse=True)
    
    #creating photos index
    #filter by machine_id / sort by created_at (newest first)
    db.photos.create_index([("machine_id", ASCENDING), ("created_at", DESCENDING)])

    #creating points index 
    db.points.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
