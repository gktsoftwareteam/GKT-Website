from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import connect_db

from app.routes.enquiry import router as enquiry_router
from app.routes.client import router as client_router
from app.routes.project import router as project_router
from app.routes.quotation import router as quotation_router
from app.routes.analytics import router as analytics_router

from app.routes import admin


app = FastAPI(
    title="GKT Backend",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://gkt-website-git-main-gktsoftwareteams-projects.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await connect_db()


app.include_router(enquiry_router)
app.include_router(client_router)
app.include_router(project_router)
app.include_router(quotation_router)
app.include_router(admin.router)
app.include_router(analytics_router)


@app.get("/")
async def home():
    return {
        "message": "GKT Backend is running successfully!"
    }
