from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from app.database import database

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


# =========================================================
# GET ANALYTICS
# =========================================================

@router.get("")
async def get_analytics():

    try:

        # -------------------------------------------------
        # ENQUIRIES
        # -------------------------------------------------

        total_enquiries = await database.enquiries.count_documents({})

        new_enquiries = await database.enquiries.count_documents({
            "status": "New"
        })

        converted_enquiries = await database.enquiries.count_documents({
            "status": "Converted"
        })

        completed_enquiries = await database.enquiries.count_documents({
            "status": "Completed"
        })

        pending_enquiries = await database.enquiries.count_documents({
            "status": "Pending"
        })

        # -------------------------------------------------
        # CLIENTS
        # -------------------------------------------------

        total_clients = await database.clients.count_documents({})

        active_clients = await database.clients.count_documents({
            "status": "Active"
        })

        pending_clients = await database.clients.count_documents({
            "status": "Pending"
        })

        completed_clients = await database.clients.count_documents({
            "status": "Completed"
        })

        # -------------------------------------------------
        # PROJECTS
        # -------------------------------------------------

        total_projects = await database.projects.count_documents({})

        pending_projects = await database.projects.count_documents({
            "status": "Pending"
        })

        in_progress_projects = await database.projects.count_documents({
            "status": "In Progress"
        })

        completed_projects = await database.projects.count_documents({
            "status": "Completed"
        })

        # -------------------------------------------------
        # QUOTATIONS
        # -------------------------------------------------

        total_quotations = await database.quotations.count_documents({})

        draft_quotations = await database.quotations.count_documents({
            "status": "Draft"
        })

        sent_quotations = await database.quotations.count_documents({
            "status": "Sent"
        })

        accepted_quotations = await database.quotations.count_documents({
            "status": "Accepted"
        })

        rejected_quotations = await database.quotations.count_documents({
            "status": "Rejected"
        })

        # -------------------------------------------------
        # QUOTATION REVENUE
        # -------------------------------------------------

        quotation_cursor = database.quotations.find(
            {},
            {
                "total": 1
            }
        )

        quotation_revenue = 0.0

        async for quotation in quotation_cursor:

            quotation_revenue += float(
                quotation.get("total", 0) or 0
            )

        # -------------------------------------------------
        # ACCEPTED REVENUE
        # -------------------------------------------------

        accepted_cursor = database.quotations.find(
            {
                "status": "Accepted"
            },
            {
                "total": 1
            }
        )

        accepted_revenue = 0.0

        async for quotation in accepted_cursor:

            accepted_revenue += float(
                quotation.get("total", 0) or 0
            )

        # -------------------------------------------------
        # MONTHLY ENQUIRIES
        # -------------------------------------------------

        current_year = datetime.now(
            timezone.utc
        ).year

        monthly_enquiries = []

        for month in range(1, 13):

            start_date = datetime(
                current_year,
                month,
                1,
                tzinfo=timezone.utc
            )

            if month == 12:

                end_date = datetime(
                    current_year + 1,
                    1,
                    1,
                    tzinfo=timezone.utc
                )

            else:

                end_date = datetime(
                    current_year,
                    month + 1,
                    1,
                    tzinfo=timezone.utc
                )

            count = await database.enquiries.count_documents({

                "createdAt": {
                    "$gte": start_date,
                    "$lt": end_date
                }

            })

            monthly_enquiries.append({
                "month": start_date.strftime("%b"),
                "count": count
            })

        # -------------------------------------------------
        # MONTHLY QUOTATIONS
        # -------------------------------------------------

        monthly_quotations = []

        for month in range(1, 13):

            start_date = datetime(
                current_year,
                month,
                1,
                tzinfo=timezone.utc
            )

            if month == 12:

                end_date = datetime(
                    current_year + 1,
                    1,
                    1,
                    tzinfo=timezone.utc
                )

            else:

                end_date = datetime(
                    current_year,
                    month + 1,
                    1,
                    tzinfo=timezone.utc
                )

            count = await database.quotations.count_documents({

                "createdAt": {
                    "$gte": start_date,
                    "$lt": end_date
                }

            })

            monthly_quotations.append({
                "month": start_date.strftime("%b"),
                "count": count
            })

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return {

            "success": True,

            "enquiries": {
                "total": total_enquiries,
                "new": new_enquiries,
                "converted": converted_enquiries,
                "completed": completed_enquiries,
                "pending": pending_enquiries
            },

            "clients": {
                "total": total_clients,
                "active": active_clients,
                "pending": pending_clients,
                "completed": completed_clients
            },

            "projects": {
                "total": total_projects,
                "pending": pending_projects,
                "in_progress": in_progress_projects,
                "completed": completed_projects
            },

            "quotations": {
                "total": total_quotations,
                "draft": draft_quotations,
                "sent": sent_quotations,
                "accepted": accepted_quotations,
                "rejected": rejected_quotations
            },

            "revenue": {
                "quotation_revenue": round(
                    quotation_revenue,
                    2
                ),
                "accepted_revenue": round(
                    accepted_revenue,
                    2
                )
            },

            "monthly_enquiries": monthly_enquiries,

            "monthly_quotations": monthly_quotations

        }

    except Exception as e:

        print(
            "ANALYTICS ERROR:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to load analytics"
        )