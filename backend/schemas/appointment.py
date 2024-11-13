from datetime import datetime
from pydantic import BaseModel


class AppointmentCheck(BaseModel):
    date: datetime
    user_id: int | None = None


class Appointment(AppointmentCheck):
    complaints: str
    status_id: int


class AppointmentDBAll():
    def __init__(self, id: int, appointment_date: datetime, status_id: int, doctor_id: int, doctor_email: str, doctor_name: str, doctor_surname: str, doctor_spec_name: str, patient_id: int, patient_email: str, patient_name: str, patient_surname: str):
        self.id = id
        self.appointment_date = str(appointment_date)
        self.status_id = status_id
        self.doctor_id = doctor_id
        self.doctor_email = doctor_email
        self.doctor_name = doctor_name
        self.doctor_surname = doctor_surname
        self.doctor_spec_name = doctor_spec_name
        self.patient_id = patient_id
        self.patient_email = patient_email
        self.patient_name = patient_name
        self.patient_surname = patient_surname

    def to_dict(self):
        return {
            "id": self.id,
            "appointment_date": self.appointment_date,
            "status_id": self.status_id,
            "doctor_id": self.doctor_id,
            "doctor_email": self.doctor_email,
            "doctor_name": self.doctor_name,
            "doctor_surname": self.doctor_surname,
            "doctor_spec_name": self.doctor_spec_name,
            "patient_id": self.patient_id,
            "patient_email": self.patient_email,
            "patient_name": self.patient_name,
            "patient_surname": self.patient_surname
        }


class AppointmentDBId(AppointmentDBAll):
    def __init__(self, id: int, appointment_date: datetime, complaints: str, status_id: int, doctor_id: int, doctor_email: str, doctor_name: str, doctor_surname: str, doctor_q_name: str, doctor_spec_name: str, patient_id: int, patient_email: str, patient_name: str, patient_surname: str):
        self.complaints = complaints
        self.doctor_q_name = doctor_q_name
        super().__init__(id, appointment_date, status_id, doctor_id, doctor_email, doctor_name,
                         doctor_surname, doctor_spec_name, patient_id, patient_email, patient_name, patient_surname)

    def to_dict(self):
        res = super().to_dict()
        res['complaints'] = self.complaints
        res['doctor_q_name'] = self.doctor_q_name
        return res
