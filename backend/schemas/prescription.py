from datetime import date
from pydantic import BaseModel


class Prescription(BaseModel):
    dosage: float
    medication_id: int


class PrescriptionDb():
    def __init__(self, id: int, dosage: float, issue_date: date, medication_id: int, medication_name: str, record_id: int):
        self.id = id
        self.dosage = float(dosage)
        self.issue_date = str(issue_date)
        self.medication_id = medication_id
        self.record_id = record_id
        self.med_name = medication_name

    def to_dict(self):
        return {
            "id": self.id,
            "dosage": self.dosage,
            "issue_date": self.issue_date,
            "medication_id": self.medication_id,
            "record_id": self.record_id,
            "med_name": self.med_name,
        }
