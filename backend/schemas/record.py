from datetime import date
from pydantic import BaseModel


class Record(BaseModel):
    diagnosis_id: int
    recomendations: str
    patient_id: int
    app_id: int


class MedicalRecordDb():
    def __init__(self, id: int, conclusion_date: date, recomendations: str, diagnosis_name: str, doctor_id: int, doctor_email: str,      doctor_name: str, doctor_surname: str, doctor_qualification: str, doctor_specialization: str, patient_id: int, patient_email: str, patient_name: str, patient_surname: str, patient_birthday: date, gender: str):
        self.id = id
        self.conclusion_date = str(conclusion_date)
        self.recomendations = recomendations
        self.diagnosis_name = diagnosis_name
        self.doctor_id = doctor_id
        self.doctor_email = doctor_email
        self.doctor_name = doctor_name
        self.doctor_surname = doctor_surname
        self.doc_qual = doctor_qualification
        self.doc_spec = doctor_specialization
        self.patient_id = patient_id
        self.patient_email = patient_email
        self.patient_name = patient_name
        self.patient_surname = patient_surname
        self.patient_birthday = str(patient_birthday)
        self.patient_gender = gender

    def to_dict(self):
        return {
            "id": self.id,
            "conclusion_date": self.conclusion_date,
            "recomendations": self.recomendations,
            "diagnosis_name": self.diagnosis_name,
            "doctor_id": self.doctor_id,
            "doctor_email": self.doctor_email,
            "doctor_name": self.doctor_name,
            "doctor_surname": self.doctor_surname,
            "doc_qual": self.doc_qual,
            "doc_spec": self.doc_spec,
            "patient_id": self.patient_id,
            "patient_email": self.patient_email,
            "patient_name": self.patient_name,
            "patient_surname": self.patient_surname,
            "patient_birthday": self.patient_birthday,
            "patient_gender": self.patient_gender
        }
