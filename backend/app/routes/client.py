from fastapi import APIRouter, HTTPException
from app.database import database
from app.models.client import Client
from bson import ObjectId
from bson.errors import InvalidId


router = APIRouter(
    prefix="/api",
    tags=["Clients"]
)



# ==================================
# CREATE CLIENT
# ==================================

@router.post("/clients")
async def create_client(client: Client):

    result = await database.clients.insert_one(
        client.dict()
    )

    return {
        "message": "Client added successfully",
        "id": str(result.inserted_id)
    }




# ==================================
# GET ALL CLIENTS
# ==================================

@router.get("/clients")
async def get_clients():

    clients = []


    async for client in database.clients.find():

        client["_id"] = str(client["_id"])

        clients.append(client)


    return clients





# ==================================
# GET SINGLE CLIENT
# ==================================

@router.get("/clients/{client_id}")
async def get_client(client_id:str):

    try:

        client = await database.clients.find_one(
            {
                "_id": ObjectId(client_id)
            }
        )


    except InvalidId:

        client = await database.clients.find_one(
            {
                "_id": client_id
            }
        )



    if client is None:

        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )


    client["_id"] = str(client["_id"])


    return client






# ==================================
# UPDATE CLIENT
# ==================================

@router.put("/clients/{client_id}")
async def update_client(
    client_id:str,
    client:dict
):


    try:


        result = await database.clients.update_one(

            {
                "_id": ObjectId(client_id)
            },

            {
                "$set": client
            }

        )


    except InvalidId:


        result = await database.clients.update_one(

            {
                "_id": client_id
            },

            {
                "$set": client
            }

        )




    if result.matched_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Client not found"

        )



    return {

        "message":"Client updated successfully"

    }







# ==================================
# DELETE CLIENT
# ==================================

@router.delete("/clients/{client_id}")
async def delete_client(client_id:str):


    try:


        result = await database.clients.delete_one(

            {
                "_id": ObjectId(client_id)
            }

        )


    except InvalidId:


        result = await database.clients.delete_one(

            {
                "_id": client_id
            }

        )





    if result.deleted_count == 0:


        raise HTTPException(

            status_code=404,

            detail="Client not found"

        )




    return {

        "message":"Client deleted successfully"

    }