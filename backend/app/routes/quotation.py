from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from bson.errors import InvalidId

from app.database import database
from app.models.quotation import (
    QuotationCreate,
    QuotationUpdate
)

router = APIRouter(
    prefix="/api/quotations",
    tags=["Quotations"]
)


# =========================================================
# HELPER
# =========================================================

def calculate_totals(data):

    subtotal = 0

    for item in data.get("items", []):

        quantity = float(item.get("quantity", 0))
        rate = float(item.get("rate", 0))

        amount = quantity * rate

        item["amount"] = amount

        subtotal += amount

    discount = float(data.get("discount", 0))
    gst_percentage = float(data.get("gst_percentage", 18))

    taxable_amount = max(subtotal - discount, 0)

    gst_amount = taxable_amount * gst_percentage / 100

    total = taxable_amount + gst_amount

    return {
        "subtotal": round(subtotal, 2),
        "discount": round(discount, 2),
        "taxable_amount": round(taxable_amount, 2),
        "gst_percentage": gst_percentage,
        "gst_amount": round(gst_amount, 2),
        "total": round(total, 2)
    }


# =========================================================
# CREATE QUOTATION
# =========================================================

@router.post("")
async def create_quotation(data: QuotationCreate):

    try:

        quotation_data = data.model_dump()

        now = datetime.now(timezone.utc)

        # Generate quotation number
        count = await database.quotations.count_documents({})

        quotation_number = (
            f"GKT-QTN-{count + 1:04d}"
        )

        # Calculate totals
        totals = calculate_totals(
            quotation_data
        )

        quotation_data.update(totals)

        quotation_data["quotation_number"] = quotation_number

        quotation_data["createdAt"] = now

        quotation_data["updatedAt"] = now

        quotation_data["valid_until"] = (
            now +
            timedelta(
                days=quotation_data.get(
                    "validity_days",
                    15
                )
            )
        )

        result = await database.quotations.insert_one(
            quotation_data
        )

        return {

            "message":
                "Quotation created successfully",

            "id":
                str(result.inserted_id),

            "quotation_number":
                quotation_number

        }

    except Exception as e:

        print(
            "CREATE QUOTATION ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create quotation"
        )


# =========================================================
# GET ALL QUOTATIONS
# =========================================================

@router.get("")
async def get_quotations():

    try:

        quotations = []

        async for quotation in database.quotations.find(
            {}
        ).sort(
            "createdAt",
            -1
        ):

            quotation["_id"] = str(
                quotation["_id"]
            )

            quotations.append(
                quotation
            )

        return quotations

    except Exception as e:

        print(
            "GET QUOTATIONS ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch quotations"
        )


# =========================================================
# GET SINGLE QUOTATION
# =========================================================

@router.get("/{quotation_id}")
async def get_quotation(
    quotation_id: str
):

    try:

        quotation = await database.quotations.find_one(
            {
                "_id": ObjectId(
                    quotation_id
                )
            }
        )

    except InvalidId:

        quotation = await database.quotations.find_one(
            {
                "_id": quotation_id
            }
        )

    except Exception as e:

        print(
            "GET QUOTATION ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch quotation"
        )

    if quotation is None:

        raise HTTPException(
            status_code=404,
            detail="Quotation not found"
        )

    quotation["_id"] = str(
        quotation["_id"]
    )

    return quotation


# =========================================================
# UPDATE QUOTATION
# =========================================================

@router.put("/{quotation_id}")
async def update_quotation(
    quotation_id: str,
    data: QuotationUpdate
):

    update_data = data.model_dump(
        exclude_unset=True
    )

    try:

        quotation = await database.quotations.find_one(
            {
                "_id": ObjectId(
                    quotation_id
                )
            }
        )

    except InvalidId:

        quotation = await database.quotations.find_one(
            {
                "_id": quotation_id
            }
        )

    if quotation is None:

        raise HTTPException(
            status_code=404,
            detail="Quotation not found"
        )

    # Merge existing data with updates
    merged_data = {
        **quotation,
        **update_data
    }

    # Recalculate if financial fields/items changed
    if (
        "items" in update_data
        or "discount" in update_data
        or "gst_percentage" in update_data
    ):

        totals = calculate_totals(
            merged_data
        )

        update_data.update(
            totals
        )

    update_data["updatedAt"] = (
        datetime.now(timezone.utc)
    )

    try:

        result = await database.quotations.update_one(

            {
                "_id": quotation["_id"]
            },

            {
                "$set": update_data
            }

        )

    except Exception as e:

        print(
            "UPDATE QUOTATION ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update quotation"
        )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Quotation not found"
        )

    return {

        "message":
            "Quotation updated successfully"

    }


# =========================================================
# UPDATE QUOTATION STATUS
# =========================================================

@router.put("/{quotation_id}/status")
async def update_quotation_status(
    quotation_id: str,
    status: str
):

    allowed_statuses = [
        "Draft",
        "Sent",
        "Viewed",
        "Accepted",
        "Rejected",
        "Expired"
    ]

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid quotation status"
            )
        )

    try:

        result = await database.quotations.update_one(

            {
                "_id": ObjectId(
                    quotation_id
                )
            },

            {
                "$set": {
                    "status": status,
                    "updatedAt":
                        datetime.now(
                            timezone.utc
                        )
                }
            }

        )

    except InvalidId:

        result = await database.quotations.update_one(

            {
                "_id": quotation_id
            },

            {
                "$set": {
                    "status": status,
                    "updatedAt":
                        datetime.now(
                            timezone.utc
                        )
                }
            }

        )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Quotation not found"
        )

    return {

        "message":
            "Quotation status updated successfully",

        "status":
            status

    }


# =========================================================
# DELETE QUOTATION
# =========================================================

@router.delete("/{quotation_id}")
async def delete_quotation(
    quotation_id: str
):

    try:

        result = await database.quotations.delete_one(
            {
                "_id": ObjectId(
                    quotation_id
                )
            }
        )

    except InvalidId:

        result = await database.quotations.delete_one(
            {
                "_id": quotation_id
            }
        )

    except Exception as e:

        print(
            "DELETE QUOTATION ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete quotation"
        )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Quotation not found"
        )

    return {

        "message":
            "Quotation deleted successfully"

    }