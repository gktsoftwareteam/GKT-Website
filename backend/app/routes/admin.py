from fastapi import APIRouter, HTTPException

from app.models.admin import AdminLogin
from app.auth import create_access_token


router = APIRouter(
    prefix="/api",
    tags=["Admin"]
)


ADMIN_EMAIL = "gktsoftwaresolution@gmail.com"
ADMIN_PASSWORD = "gktsoftwareteam@2002"



@router.post("/admin/login")
async def login(admin: AdminLogin):


    if (
        admin.email != ADMIN_EMAIL or
        admin.password != ADMIN_PASSWORD
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    token = create_access_token(
        {
            "sub":admin.email
        }
    )


    return {

        "access_token":token,

        "token_type":"bearer"

    }