from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional


class QuotationItem(BaseModel):
    description: str
    quantity: float = 1
    rate: float = 0
    amount: float = 0


class QuotationCreate(BaseModel):

    client_name: str
    company_name: Optional[str] = ""
    client_email: EmailStr
    client_phone: Optional[str] = ""

    project_name: str
    project_id: Optional[str] = ""

    items: List[QuotationItem]

    discount: float = 0
    gst_percentage: float = 18

    validity_days: int = 15

    terms: Optional[str] = (
        "1. This quotation is valid for the mentioned validity period.\n"
        "2. Project work will begin after confirmation.\n"
        "3. Payment terms will be mutually agreed upon.\n"
        "4. Additional requirements may incur additional charges.\n"
        "5. Delivery timelines depend on project requirements and client feedback."
    )

    status: str = "Draft"


class QuotationUpdate(BaseModel):

    client_name: Optional[str] = None
    company_name: Optional[str] = None
    client_email: Optional[EmailStr] = None
    client_phone: Optional[str] = None

    project_name: Optional[str] = None
    project_id: Optional[str] = None

    items: Optional[List[QuotationItem]] = None

    discount: Optional[float] = None
    gst_percentage: Optional[float] = None

    validity_days: Optional[int] = None

    terms: Optional[str] = None

    status: Optional[str] = None