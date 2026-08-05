from pydantic import BaseModel, EmailStr

class Client(BaseModel):
    company: str
    contact: str
    email: EmailStr
    phone: str
    project: str
    status: str = "Active"