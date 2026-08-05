from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import connect_db
from app.routes.enquiry import router as enquiry_router
from app.routes.client import router as client_router
from app.routes import admin


app = FastAPI(
    title="GKT Backend",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
@app.on_event("startup")
async def startup():
    await connect_db()

# Routers
app.include_router(
    enquiry_router,
    prefix="/api",
    tags=["Enquiries"]
)

app.include_router(
    client_router,
    prefix="/api",
    tags=["Clients"]
)

app.include_router(admin.router)
# Home
@app.get("/")
def home():
    return {
        "message": "Backend is running successfully!"
    }