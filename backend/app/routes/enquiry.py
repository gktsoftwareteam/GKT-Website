from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId

from datetime import datetime, timezone

from app.database import database
from app.utils.email import send_email


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api",
    tags=["Enquiries"]
)


# =========================================================
# STATUS OPTIONS
# =========================================================

ENQUIRY_STATUSES = [
    "New",
    "In Progress",
    "Pending",
    "Completed",
    "Waiting Client",
    "Rejected",
    "Converted"
]


# =========================================================
# MODELS
# =========================================================

class Enquiry(BaseModel):

    name: str
    email: EmailStr
    phone: str
    service: str
    message: str
    status: Optional[str] = "New"


class ReplyRequest(BaseModel):

    email: EmailStr
    message: str


class StatusRequest(BaseModel):

    status: str


# =========================================================
# GET ALL ENQUIRIES
# =========================================================

@router.get("/enquiries")
async def get_enquiries():

    try:

        enquiries = []

        async for enquiry in database.enquiries.find().sort(
            "createdAt",
            -1
        ):

            enquiry["_id"] = str(enquiry["_id"])

            enquiries.append(enquiry)

        return enquiries

    except Exception as e:

        print("GET ENQUIRIES ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch enquiries"
        )


# =========================================================
# CREATE ENQUIRY
# =========================================================

@router.post("/enquiries")
async def create_enquiry(data: Enquiry):

    try:

        enquiry = data.model_dump()

        # Always start new enquiry as New
        enquiry["status"] = "New"

        # Date and time
        enquiry["createdAt"] = datetime.now(timezone.utc)

        result = await database.enquiries.insert_one(
            enquiry
        )

        return {

            "message": "Enquiry submitted successfully",

            "id": str(result.inserted_id)

        }

    except Exception as e:

        print("CREATE ENQUIRY ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to submit enquiry"
        )


# =========================================================
# DELETE ENQUIRY
# =========================================================

@router.delete("/enquiries/{id}")
async def delete_enquiry(id: str):

    try:

        try:

            result = await database.enquiries.delete_one(
                {
                    "_id": ObjectId(id)
                }
            )

        except InvalidId:

            result = await database.enquiries.delete_one(
                {
                    "_id": id
                }
            )

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Enquiry not found"
            )

        return {

            "message": "Enquiry deleted successfully"

        }

    except HTTPException:

        raise

    except Exception as e:

        print("DELETE ENQUIRY ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to delete enquiry"
        )


# =========================================================
# UPDATE ENQUIRY STATUS
# =========================================================

@router.put("/enquiries/{id}/status")
async def update_status(
    id: str,
    data: StatusRequest
):

    status = data.status.strip()

    if not status:

        raise HTTPException(
            status_code=400,
            detail="Status is required"
        )

    if status not in ENQUIRY_STATUSES:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {', '.join(ENQUIRY_STATUSES)}"
        )

    try:

        try:

            result = await database.enquiries.update_one(

                {
                    "_id": ObjectId(id)
                },

                {
                    "$set": {
                        "status": status
                    }
                }

            )

        except InvalidId:

            result = await database.enquiries.update_one(

                {
                    "_id": id
                },

                {
                    "$set": {
                        "status": status
                    }
                }

            )

        if result.matched_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Enquiry not found"
            )

        return {

            "message": "Status updated successfully",

            "status": status

        }

    except HTTPException:

        raise

    except Exception as e:

        print("UPDATE STATUS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to update enquiry status"
        )


# =========================================================
# CONVERT ENQUIRY TO CLIENT
# =========================================================

@router.post("/enquiries/{id}/convert")
async def convert_client(id: str):

    # -----------------------------------------
    # Find enquiry
    # -----------------------------------------

    try:

        try:

            enquiry = await database.enquiries.find_one(
                {
                    "_id": ObjectId(id)
                }
            )

        except InvalidId:

            enquiry = await database.enquiries.find_one(
                {
                    "_id": id
                }
            )

    except Exception as e:

        print("FIND ENQUIRY ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to find enquiry"
        )


    # -----------------------------------------
    # Check enquiry
    # -----------------------------------------

    if enquiry is None:

        raise HTTPException(
            status_code=404,
            detail="Enquiry not found"
        )


    # -----------------------------------------
    # Prevent duplicate conversion
    # -----------------------------------------

    if enquiry.get("status") == "Converted":

        raise HTTPException(
            status_code=400,
            detail="This enquiry has already been converted"
        )


    # -----------------------------------------
    # Create client
    # -----------------------------------------

    client = {

        "company": enquiry.get(
            "company",
            enquiry.get("name")
        ),

        "contact": enquiry.get("name"),

        "email": enquiry.get("email"),

        "phone": enquiry.get("phone"),

        "project": enquiry.get("service"),

        "status": "Active",

        "createdAt": datetime.now(timezone.utc)

    }


    # -----------------------------------------
    # Insert client
    # -----------------------------------------

    try:

        client_result = await database.clients.insert_one(
            client
        )

    except Exception as e:

        print("CREATE CLIENT ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to create client"
        )


    # -----------------------------------------
    # Update enquiry
    # -----------------------------------------

    try:

        await database.enquiries.update_one(

            {
                "_id": enquiry["_id"]
            },

            {
                "$set": {
                    "status": "Converted"
                }
            }

        )

    except Exception as e:

        print("UPDATE CONVERTED STATUS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Client created but enquiry status could not be updated"
        )


    return {

        "message": "Converted to client successfully",

        "client_id": str(client_result.inserted_id)

    }


# =========================================================
# SEND EMAIL REPLY
# =========================================================

@router.post("/enquiries/reply")
async def reply_customer(data: ReplyRequest):

    try:

        print("====================================")
        print("REPLY EMAIL REQUEST")
        print("To:", data.email)
        print("Message:", data.message)
        print("====================================")

        await send_email(
            data.email,
            "GKT Software Solution Reply",
            data.message
        )

        return {
            "message": "Email sent successfully"
        }

    except Exception as e:

        print("====================================")
        print("EMAIL ERROR")
        print(repr(e))
        print("====================================")

        raise HTTPException(
            status_code=500,
            detail=f"Email sending failed: {str(e)}"
        )