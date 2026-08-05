from pydantic import BaseModel, EmailStr
from typing import Optional

class Enquiry(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    message: str
    status: Optional[str] = "New"