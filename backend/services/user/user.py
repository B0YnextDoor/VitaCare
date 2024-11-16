from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from core.security import hash_password
from schemas.user import User
from services.user.doctor import DoctorService
from services.user.patient import PatientService
from schemas.auth import PatientSignUp, PatientUpdate, DoctorSignUp, UserDb, UserSignUp


class UserService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]],
                 doctorService: DoctorService, patientService: PatientService) -> None:
        self.session = session
        self.exception = "exception occured - user not"
        self.doctorService = doctorService
        self.patientService = patientService

    def getPatients(self):
        return self.patientService.getAll()

    def getDoctors(self):
        return self.doctorService.getAll()

    def getUserById(self, user_id: int | None, role: int | None):
        if user_id is None or role is None:
            return 'bad token'
        if role == 1:
            return self.getUserInfo(user_id)
        user = self.doctorService.getById(
            user_id) if role == 2 else self.patientService.getById(user_id)
        return user if user is not None else 'user not found'

    def getUserByEmail(self, email: str):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT "id", "password", "role_id" FROM "users" WHERE "email"=:email''')
                user = db.execute(sql, {'email': email}).first()
                return UserDb(email, *user) if user is not None else None
        except Exception:
            return None

    def getUserInfo(self, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT "name", "surname" FROM "user_infos" WHERE "user_id"=:id''')
                info = db.execute(sql, {"id": user_id}).first()
                if info is None:
                    return "user not found"
                sql = text('''SELECT "email" FROM "users" WHERE "id"=:id''')
                email = db.execute(sql, {"id": user_id}).scalar()
                if email is None:
                    return "user not found"
                return User(user_id, 1, email, *info).to_dict()
        except Exception:
            return None

    def createUser(self, email: str, password: str, name: str, surname: str, role: str):
        try:
            with self.session() as db:
                sql = text('''SELECT id FROM "roles" WHERE "name"=:role''')
                role_id = db.execute(sql, {'role': role}).scalar()
                if role_id is None:
                    return 'role not found'
                sql = text('''SELECT "id" FROM "users" WHERE "email"=:email''')
                email_check = db.execute(sql, {'email': email}).scalar()
                if email_check is not None:
                    return 'user with this email is already registered'
                hashed_password = hash_password(password)
                if hashed_password is None:
                    return 'password hash error'
                sql = text(
                    '''INSERT INTO "users" ("email", "password", "role_id") VALUES (:email, :password, :role_id) RETURNING id''')
                new_user_id = db.execute(
                    sql, {'email': email, 'password': hashed_password, 'role_id': role_id}).scalar()
                if new_user_id is None:
                    return 'create user error'
                db.commit()
                sql = text(
                    '''INSERT INTO "user_infos" ("name", "surname", "user_id") VALUES (:name, :surname, :user_id) RETURNING id''')
                user_info = db.execute(
                    sql, {'name': name, 'surname': surname, 'user_id': int(new_user_id)}).scalar()
                if user_info is None:
                    return 'create user info error'
                db.commit()
                return int(new_user_id)
        except Exception as e:
            print(e)
            return f"{self.exception} created"

    def createPatient(self, data: PatientSignUp):
        user_id = self.createUser(
            data.email, data.password, data.name, data.surname, 'patient')
        return self.patientService.createPatient(data.birthday, data.gender, user_id) if type(user_id) is int else str(user_id)

    def createDoctor(self, data: DoctorSignUp):
        user_id = self.createUser(
            data.email, "Test123test", data.name, data.surname, 'doctor')
        return self.doctorService.createDoctor(data.qualification_id, data.specialization_id, user_id) if type(user_id) is int else str(user_id)

    def updateUser(self, email: str, password: str, name: str, surname: str, user_id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT "id" FROM "users" WHERE "email"=:email''')
                email_check = db.execute(sql, {'email': email}).scalar()
                if email_check is not None and email_check != user_id:
                    return 'user with this email is already registered'
                hashed_password = hash_password(password)
                if hashed_password is None:
                    return 'password hash error'
                sql = text(
                    '''UPDATE "users" SET "email"=:email,"password"=:password WHERE "id"=:user_id RETURNING id''')
                upd_user = db.execute(
                    sql, {'email': email, 'password': hashed_password, 'user_id': user_id}).scalar()
                if upd_user is None:
                    return 'update user error'
                db.commit()
                sql = text(
                    '''UPDATE "user_infos" SET "name"=:name, "surname"=:surname WHERE "user_id"=:user_id RETURNING id''')
                upd_user_info = db.execute(
                    sql, {'name': name, 'surname': surname, 'user_id': user_id}).scalar()
                if upd_user_info is None:
                    return 'update user info error'
                db.commit()
                return user_id
        except Exception as e:
            print(e)
            return f"{self.exception} updated"

    def updatePatient(self, data: PatientUpdate, user_id: int):
        upd_user_id = self.updateUser(
            data.email, data.password, data.name, data.surname, user_id)
        return self.patientService.updatePatient(data.birthday, data.gender, data.weight, data.height, upd_user_id) if type(upd_user_id) is int else upd_user_id

    def updateProfile(self, data: UserSignUp | PatientUpdate, user_id: int | None, role: int | None):
        if user_id is None or role is None:
            return 'bad token'
        if role == 3:
            return self.updatePatient(data, user_id)
        upd_user_id = self.updateUser(
            data.email, data.password, data.name, data.surname, user_id)
        return self.getUserInfo(user_id) if type(upd_user_id) is int else str(upd_user_id)

    def deleteUser(self, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''DELETE FROM "users" WHERE "id"=:user_id RETURNING id''')
                result = db.execute(sql, {'user_id': user_id}).scalar()
                db.commit()
                return 'success' if result is not None else None
        except Exception:
            return f'{self.exception} deleted'
