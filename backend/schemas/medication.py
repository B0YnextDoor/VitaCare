from pydantic import BaseModel


class Medication(BaseModel):
    name: str
    description: str
    price: float


class MedicationDB():
    def __init__(self, id: int, name: str, description: str, price: float):
        self.id = id
        self.name = name
        self.description = description
        self.price = float(price)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price
        }
