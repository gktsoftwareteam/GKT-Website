from fastapi import APIRouter, HTTPException

from app.database import database
from app.models.client import Client

from bson import ObjectId
from bson.errors import InvalidId


router = APIRouter(
    prefix="/api",
    tags=["Clients"]
)


# =========================================================
# CLIENT STATUS OPTIONS
# =========================================================

CLIENT_STATUSES = [
    "Active",
    "Pending",
    "Completed",
    "Inactive"
]


# =========================================================
# CREATE CLIENT
# =========================================================

@router.post("/clients")
async def create_client(client: Client):

    try:

        client_data = client.model_dump()

        client_data.pop("_id", None)

        if not client_data.get("status"):
            client_data["status"] = "Active"

        result = await database.clients.insert_one(
            client_data
        )

        return {

            "message": "Client added successfully",

            "id": str(result.inserted_id)

        }

    except Exception as e:

        print("CREATE CLIENT ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to create client"
        )


# =========================================================
# GET ALL CLIENTS
# =========================================================

@router.get("/clients")
async def get_clients():

    try:

        clients = []

        async for client in database.clients.find().sort(
            "createdAt",
            -1
        ):

            client["_id"] = str(client["_id"])

            clients.append(client)

        return clients

    except Exception as e:

        print("GET CLIENTS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch clients"
        )


# =========================================================
# GET SINGLE CLIENT
# =========================================================

@router.get("/clients/{client_id}")
async def get_client(client_id: str):

    try:

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

    except HTTPException:

        raise

    except Exception as e:

        print("GET SINGLE CLIENT ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch client"
        )


# =========================================================
# UPDATE CLIENT
# =========================================================

@router.put("/clients/{client_id}")
async def update_client(
    client_id: str,
    client: dict
):

    try:

        # IMPORTANT:
        # MongoDB _id cannot be changed

        client.pop("_id", None)


        # Validate status if supplied

        if "status" in client:

            if client["status"] not in CLIENT_STATUSES:

                raise HTTPException(

                    status_code=400,

                    detail=
                    f"Invalid status. Allowed: "
                    f"{', '.join(CLIENT_STATUSES)}"

                )


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

            "message": "Client updated successfully"

        }


    except HTTPException:

        raise

    except Exception as e:

        print("UPDATE CLIENT ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail="Failed to update client"

        )


# =========================================================
# DELETE CLIENT
# =========================================================

@router.delete("/clients/{client_id}")
async def delete_client(client_id: str):

    try:

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

            "message": "Client deleted successfully"

        }


    except HTTPException:

        raise

    except Exception as e:

        print("DELETE CLIENT ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail="Failed to delete client"

        )