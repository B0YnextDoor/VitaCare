from datetime import date
from pydantic import BaseModel


class TokenData():
    def __init__(self, id: int, role: int):
        self.id = id
        self.role = role


class UserAuth(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True


class UserDb():
    def __init__(self, email: str, user_id: int, password: str, role_id: int):
        self.email = email
        self.password = password
        self.user_id = user_id
        self.role_id = role_id


class UserSignUp(UserAuth):
    name: str
    surname: str

    class Config:
        from_attributes = True


class PatientSignUp(UserSignUp):
    birthday: date
    gender: str

    class Config:
        from_attributes = True


class PatientUpdate(PatientSignUp):
    weight: float | None
    height: float | None

    class Config:
        from_attributes = True


class DoctorSignUp(UserSignUp):
    qualification_id: int
    specialization_id: int
    password: str | None = None

    class Config:
        from_attributes = True


class DoctorUpdate(BaseModel):
    qualification_id: int
    specialization_id: int
