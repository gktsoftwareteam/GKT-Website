from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from app.database import database


router = APIRouter(
    prefix="/api",
    tags=["Analytics"]
)


# =========================================================
# GET ANALYTICS DASHBOARD DATA
# =========================================================

@router.get("/analytics")
async def get_analytics():

    try:

        # =================================================
        # TOTAL COUNTS
        # =================================================

        total_enquiries = await database.enquiries.count_documents({})

        total_clients = await database.clients.count_documents({})

        total_projects = await database.projects.count_documents({})


        # =================================================
        # ENQUIRY STATUS COUNTS
        # =================================================

        new_enquiries = await database.enquiries.count_documents({
            "status": "New"
        })

        in_progress_enquiries = await database.enquiries.count_documents({
            "status": "In Progress"
        })

        completed_enquiries = await database.enquiries.count_documents({
            "status": "Completed"
        })

        waiting_client_enquiries = await database.enquiries.count_documents({
            "status": "Waiting Client"
        })

        rejected_enquiries = await database.enquiries.count_documents({
            "status": "Rejected"
        })

        converted_enquiries = await database.enquiries.count_documents({
            "status": "Converted"
        })


        # =================================================
        # PROJECT STATUS COUNTS
        # =================================================

        pending_projects = await database.projects.count_documents({
            "status": "Pending"
        })

        project_in_progress = await database.projects.count_documents({
            "status": "In Progress"
        })

        completed_projects = await database.projects.count_documents({
            "status": "Completed"
        })


        # =================================================
        # MONTHLY ENQUIRIES
        # =================================================

        current_year = datetime.now(timezone.utc).year

        monthly_enquiries = {
            "Jan": 0,
            "Feb": 0,
            "Mar": 0,
            "Apr": 0,
            "May": 0,
            "Jun": 0,
            "Jul": 0,
            "Aug": 0,
            "Sep": 0,
            "Oct": 0,
            "Nov": 0,
            "Dec": 0
        }


        # Get enquiries that have createdAt
        async for enquiry in database.enquiries.find(
            {
                "createdAt": {
                    "$exists": True
                }
            }
        ):

            created_at = enquiry.get("createdAt")

            if not created_at:
                continue


            # MongoDB normally returns datetime
            if isinstance(created_at, datetime):

                if created_at.year == current_year:

                    month_number = created_at.month

                    month_name = datetime(
                        current_year,
                        month_number,
                        1
                    ).strftime("%b")

                    monthly_enquiries[month_name] += 1


        # =================================================
        # CONVERSION RATE
        # =================================================

        if total_enquiries > 0:

            conversion_rate = round(
                (converted_enquiries / total_enquiries) * 100,
                2
            )

        else:

            conversion_rate = 0


        # =================================================
        # REVENUE
        # =================================================

        total_revenue = 0

        async for project in database.projects.find({}):

            amount = project.get("revenue")

            if amount is None:
                amount = project.get("budget")

            if amount is None:
                amount = project.get("amount")

            if amount is None:
                continue

            try:

                total_revenue += float(amount)

            except (ValueError, TypeError):

                continue


        # =================================================
        # RECENT ENQUIRIES
        # =================================================

        recent_enquiries = []

        cursor = database.enquiries.find(
            {}
        ).sort(
            "createdAt",
            -1
        ).limit(5)


        async for enquiry in cursor:

            enquiry["_id"] = str(enquiry["_id"])

            created_at = enquiry.get("createdAt")

            if isinstance(created_at, datetime):

                enquiry["createdAt"] = created_at.isoformat()

            recent_enquiries.append(enquiry)


        # =================================================
        # RECENT PROJECTS
        # =================================================

        recent_projects = []

        cursor = database.projects.find(
            {}
        ).sort(
            "createdAt",
            -1
        ).limit(5)


        async for project in cursor:

            project["_id"] = str(project["_id"])

            created_at = project.get("createdAt")

            if isinstance(created_at, datetime):

                project["createdAt"] = created_at.isoformat()

            recent_projects.append(project)


        # =================================================
        # RESPONSE
        # =================================================

        return {

            "success": True,

            # -----------------------------
            # Main cards
            # -----------------------------

            "total_enquiries": total_enquiries,

            "total_clients": total_clients,

            "total_projects": total_projects,

            "revenue": round(total_revenue, 2),


            # -----------------------------
            # Enquiry statistics
            # -----------------------------

            "enquiry_status": {

                "New": new_enquiries,

                "In Progress": in_progress_enquiries,

                "Completed": completed_enquiries,

                "Waiting Client": waiting_client_enquiries,

                "Rejected": rejected_enquiries,

                "Converted": converted_enquiries

            },


            # -----------------------------
            # Project statistics
            # -----------------------------

            "project_status": {

                "Pending": pending_projects,

                "In Progress": project_in_progress,

                "Completed": completed_projects

            },


            # -----------------------------
            # Monthly enquiries
            # -----------------------------

            "monthly_enquiries": monthly_enquiries,


            # -----------------------------
            # Conversion
            # -----------------------------

            "conversion_rate": conversion_rate,


            # -----------------------------
            # Recent data
            # -----------------------------

            "recent_enquiries": recent_enquiries,

            "recent_projects": recent_projects

        }


    except Exception as e:

        print("ANALYTICS ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail=f"Failed to load analytics: {str(e)}"

        )