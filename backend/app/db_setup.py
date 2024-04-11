from pymongo import MongoClient
import os
from dotenv import load_dotenv
import time

def get_db():

    load_dotenv()

    DATABASE_URL= f'mongodb+srv://mood:{os.environ.get("password")}@cluster0.xwuzqxr.mongodb.net/?retryWrites=true&w=majority' 

    client = MongoClient(DATABASE_URL, maxPoolSize=100)

    mongo_db=client["moodData"]

    return mongo_db

