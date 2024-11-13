from datetime import date
from pydantic import BaseModel


class UpdateBill(BaseModel):
    status_id: int


class Bill():
    def __init__(self, id: int, amount: float, invoice_date: date, status_id: int, status_name: str, user_id: int, user_email: str, user_name: str, user_surname: str):
        self.id = id
        self.amount = float(amount)
        self.invoice_date = str(invoice_date)
        self.status_id = status_id
        self.status_name = status_name
        self.user_id = user_id
        self.user_email = user_email
        self.user_name = user_name
        self.user_surname = user_surname

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "invoice_date": self.invoice_date,
            "status_id": self.status_id,
            "status_name": self.status_name,
            "user_id": self.user_id,
            "user_email": self.user_email,
            "user_name": self.user_name,
            "user_surname": self.user_surname
        }
