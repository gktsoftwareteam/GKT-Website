from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId

from app.database import database
from app.utils.email import send_email


router = APIRouter(
    prefix="/api",
    tags=["Enquiries"]
)


# ==============================
# MODELS
# ==============================

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



# ==============================
# GET ALL ENQUIRIES
# ==============================

@router.get("/enquiries")
async def get_enquiries():

    enquiries = []


    async for enquiry in database.enquiries.find():

        enquiry["_id"] = str(enquiry["_id"])

        enquiries.append(enquiry)


    return enquiries



# ==============================
# CREATE ENQUIRY
# ==============================

@router.post("/enquiries")
async def create_enquiry(data: Enquiry):

    enquiry = data.model_dump()


    result = await database.enquiries.insert_one(enquiry)


    return {

        "message":"Enquiry submitted successfully",

        "id":str(result.inserted_id)

    }





# ==============================
# DELETE ENQUIRY
# ==============================

@router.delete("/enquiries/{id}")
async def delete_enquiry(id:str):


    try:

        object_id = ObjectId(id)

        result = await database.enquiries.delete_one(
            {
                "_id":object_id
            }
        )


    except InvalidId:


        result = await database.enquiries.delete_one(
            {
                "_id":id
            }
        )



    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Enquiry not found"
        )


    return {

        "message":"Enquiry deleted successfully"

    }





# ==============================
# UPDATE STATUS
# ==============================

@router.put("/enquiries/{id}/status")
async def update_status(
    id:str,
    data:StatusRequest
):


    try:

        result = await database.enquiries.update_one(

            {
                "_id":ObjectId(id)
            },

            {
                "$set":
                {
                    "status":data.status
                }
            }

        )


    except InvalidId:


        result = await database.enquiries.update_one(

            {
                "_id":id
            },

            {
                "$set":
                {
                    "status":data.status
                }
            }

        )



    if result.matched_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Enquiry not found"

        )



    return {

        "message":"Status updated successfully"

    }






# ==============================
# CONVERT TO CLIENT
# ==============================

@router.post("/enquiries/{id}/convert")
async def convert_client(id:str):


    try:

        enquiry = await database.enquiries.find_one(

            {
                "_id":ObjectId(id)
            }

        )


    except InvalidId:


        enquiry = await database.enquiries.find_one(

            {
                "_id":id
            }

        )



    if enquiry is None:

        raise HTTPException(

            status_code=404,

            detail="Enquiry not found"

        )




    client = {

        "company":
            enquiry.get(
                "company",
                enquiry.get("name")
            ),


        "contact":
            enquiry.get("name"),


        "email":
            enquiry.get("email"),


        "phone":
            enquiry.get("phone"),


        "project":
            enquiry.get("service"),


        "status":
            "Active"

    }



    await database.clients.insert_one(client)



    await database.enquiries.update_one(

        {
            "_id":enquiry["_id"]
        },

        {
            "$set":
            {
                "status":"Converted"
            }
        }

    )



    return {

        "message":"Converted to client successfully"

    }





# ==============================
# SEND EMAIL REPLY
# ==============================

@router.post("/enquiries/reply")
async def reply_customer(data:ReplyRequest):


    try:


        await send_email(

            data.email,

            "GKT Software Solution Reply",

            data.message

        )


        return {


            "message":
            "Email sent successfully"


        }



    except Exception as e:


        print("EMAIL ERROR:",e)


        raise HTTPException(

            status_code=500,

            detail="Email sending failed"

        )