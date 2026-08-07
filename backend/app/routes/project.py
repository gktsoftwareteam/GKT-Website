from fastapi import APIRouter, HTTPException

from pydantic import BaseModel, Field

from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId

from datetime import datetime, timezone

from app.database import database


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api",
    tags=["Projects"]
)


# =========================================================
# MODEL
# =========================================================

class Project(BaseModel):

    name: str

    client: str

    developer: str

    deadline: str

    progress: int = Field(
        default=0,
        ge=0,
        le=100
    )

    status: str = "Pending"

    description: Optional[str] = ""


# =========================================================
# CREATE PROJECT
# =========================================================

@router.post("/projects")
async def create_project(data: Project):

    try:

        project = data.model_dump()

        project["createdAt"] = datetime.now(timezone.utc)

        result = await database.projects.insert_one(
            project
        )

        return {

            "message": "Project created successfully",

            "id": str(result.inserted_id)

        }

    except Exception as e:

        print("CREATE PROJECT ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail="Failed to create project"

        )


# =========================================================
# GET ALL PROJECTS
# =========================================================

@router.get("/projects")
async def get_projects():

    try:

        projects = []

        async for project in database.projects.find().sort(
            "createdAt",
            -1
        ):

            project["_id"] = str(
                project["_id"]
            )

            projects.append(project)

        return projects

    except Exception as e:

        print("GET PROJECTS ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail="Failed to fetch projects"

        )


# =========================================================
# GET SINGLE PROJECT
# =========================================================

@router.get("/projects/{project_id}")
async def get_project(project_id: str):

    try:

        project = await database.projects.find_one(

            {
                "_id": ObjectId(project_id)
            }

        )

    except InvalidId:

        raise HTTPException(

            status_code=400,

            detail="Invalid project ID"

        )

    except Exception as e:

        print("GET PROJECT ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail="Failed to fetch project"

        )


    if project is None:

        raise HTTPException(

            status_code=404,

            detail="Project not found"

        )


    project["_id"] = str(
        project["_id"]
    )


    return project


# =========================================================
# UPDATE PROJECT
# =========================================================

@router.put("/projects/{project_id}")
async def update_project(
    project_id: str,
    data: Project
):

    try:

        object_id = ObjectId(project_id)

    except InvalidId:

        raise HTTPException(

            status_code=400,

            detail="Invalid project ID"

        )


    try:

        project_data = data.model_dump()

        result = await database.projects.update_one(

            {
                "_id": object_id
            },

            {
                "$set": project_data
            }

        )

    except Exception as e:

        print("UPDATE PROJECT ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail="Failed to update project"

        )


    if result.matched_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Project not found"

        )


    return {

        "message": "Project updated successfully"

    }


# =========================================================
# UPDATE PROJECT STATUS
# =========================================================

class ProjectStatus(BaseModel):

    status: str


@router.put("/projects/{project_id}/status")
async def update_project_status(
    project_id: str,
    data: ProjectStatus
):

    if not data.status.strip():

        raise HTTPException(

            status_code=400,

            detail="Status is required"

        )


    try:

        object_id = ObjectId(project_id)

    except InvalidId:

        raise HTTPException(

            status_code=400,

            detail="Invalid project ID"

        )


    try:

        result = await database.projects.update_one(

            {
                "_id": object_id
            },

            {
                "$set": {
                    "status": data.status
                }
            }

        )

    except Exception as e:

        print(
            "UPDATE PROJECT STATUS ERROR:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail="Failed to update project status"

        )


    if result.matched_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Project not found"

        )


    return {

        "message": "Project status updated successfully"

    }


# =========================================================
# DELETE PROJECT
# =========================================================

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):

    try:

        object_id = ObjectId(project_id)

    except InvalidId:

        raise HTTPException(

            status_code=400,

            detail="Invalid project ID"

        )


    try:

        result = await database.projects.delete_one(

            {
                "_id": object_id
            }

        )

    except Exception as e:

        print("DELETE PROJECT ERROR:", e)

        raise HTTPException(

            status_code=500,

            detail="Failed to delete project"

        )


    if result.deleted_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Project not found"

        )


    return {

        "message": "Project deleted successfully"

    }