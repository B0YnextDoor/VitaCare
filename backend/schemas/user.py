from datetime import date
from pydantic import BaseModel


class User():
    def __init__(self, id: int, role: int, email: str, name: str, surname: str):
        self.id = id
        self.role = role
        self.email = email
        self.name = name
        self.surname = surname

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "email": self.email,
            "name": self.name,
            "surname": self.surname,
        }


class Patient(User):
    def __init__(self, id: int, role: int, email: str, name: str, surname: str, patient_id: int, birthday: date, gender: str):
        super().__init__(id, role, email, name, surname)
        self.patient_id = patient_id
        self.birthday = birthday
        self.gender = gender

    def to_dict(self):
        res = super().to_dict()
        res["patient_id"] = self.patient_id,
        res["birthday"] = str(self.birthday),
        res["gender"] = self.gender
        return res


class PatientInfo(Patient):
    def __init__(self, id: int, role: int, email: str, name: str, surname: str, patient_id: int, birthday: date, gender: str, measurment_date: date | None, weight: float | None, height: float | None):
        super().__init__(id, role, email, name, surname, patient_id, birthday, gender)
        self.measurment_date = str(
            measurment_date) if measurment_date is not None else None
        self.weight = float(weight) if weight is not None else None
        self.height = float(height) if height is not None else None

    def to_dict(self):
        res = super().to_dict()
        res['measurment_date'] = self.measurment_date
        res['weight'] = self.weight
        res['height'] = self.height
        return res


class Qualification(BaseModel):
    q_name: str
    q_mult: float


class DoctorQualificationDB():
    def __init__(self, id: int, q_name: str, q_mult: float):
        self.id = id
        self.q_name = q_name
        self.q_mult = float(q_mult)

    def to_dict(self):
        return {
            "id": self.id,
            "q_name": self.q_name,
            "q_mult": self.q_mult
        }


class Specialization(BaseModel):
    spec_name: str
    spec_descr: str
    service_fee: float


class DoctorSpecializationDB():
    def __init__(self, id: int, spec_name: str, spec_descr: str, service_fee: float):
        self.id = id
        self.spec_name = spec_name
        self.spec_descr = spec_descr
        self.service_fee = float(service_fee)

    def to_dict(self):
        return {
            "id": self.id,
            "spec_name": self.spec_name,
            "spec_descr": self.spec_descr,
            "service_fee": self.service_fee
        }


class Doctor(User):
    def __init__(self, id: int, role: int, email: str, name: str, surname: str, doctor_id: int, q_id: int, q_name: str, q_mult: float, spec_id: int, spec_name: str, spec_descr: str, service_fee: float):
        super().__init__(id, role, email, name, surname)
        self.doctor_id = doctor_id
        self.qualification = DoctorQualificationDB(q_id, q_name, q_mult)
        self.specialization = DoctorSpecializationDB(
            spec_id, spec_name, spec_descr, service_fee)

    def to_dict(self):
        res = super().to_dict()
        res['doctor_id'] = self.doctor_id
        res['qualification'] = self.qualification.to_dict()
        res['specialization'] = self.specialization.to_dict()
        return res


class DoctorShort(User):
    def __init__(self, id: int, role: int, email: str, name: str, surname: str, q_name: str, spec_name: str):
        super().__init__(id, role, email, name, surname)
        self.q_name = q_name
        self.spec_name = spec_name

    def to_dict(self):
        res = super().to_dict()
        res['q_name'] = self.q_name
        res['spec_name'] = self.spec_name
        return res
