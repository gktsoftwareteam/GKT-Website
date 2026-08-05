from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Read values from .env
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Create MongoDB client
client = AsyncIOMotorClient(MONGODB_URL)

# Select database
database = client[DATABASE_NAME]

# Function to test the connection
async def connect_db():
    try:
        await client.admin.command("ping")
        print("✅ Connected to MongoDB successfully!")
        print("Database:", database.name)

    except Exception as e:
        print("❌ MongoDB Connection Error:", e)