from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


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

    createdAt: Optional[datetime] = None