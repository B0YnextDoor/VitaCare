from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from datetime import date
from schemas.user import Patient, PatientInfo


class PatientService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = "exception occured -"

    def getAll(self):
        try:
            with self.session() as db:
                sql = text('''SELECT * FROM PatientsView''')
                result = db.execute(sql)
                return [Patient(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT pv.*, pa.measurement_date, pa.weight, pa.height FROM PatientsView pv
    LEFT JOIN "patients_anthropometry" pa ON pv.patient_id = pa.patient_id WHERE pv.user_id=:user_id''')
                result = db.execute(sql, {'user_id': id}).first()
                return PatientInfo(result[0], 3, *result[1:]).to_dict() if result is not None else result
        except Exception:
            return None

    def createPatient(self, birthday: date, gender: str, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''INSERT INTO "patients" ("birthday", "gender", "user_id") VALUES (:birthday, :gender, :user_id) RETURNING id''')
                result = db.execute(
                    sql, {'birthday': str(birthday), 'gender': gender, 'user_id': user_id}).scalar()
                db.commit()
                return self.getById(user_id) if result is not None else "patient create error"
        except Exception as e:
            print(e)
            return f"{self.exception} patient not created"

    def updatePatient(self, birhday: date, gender: str, weight: float | None, height: float | None, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''UPDATE "patients" SET "birthday"=:birthday,"gender"=:gender WHERE "user_id"=:user_id RETURNING id''')
                result = db.execute(
                    sql, {'birthday': birhday, 'gender': gender, 'user_id': user_id}).scalar()
                db.commit()
                if (result is None):
                    return "patient update error"
                elif (weight is None or height is None):
                    return self.getById(user_id)
                return self.updatePatientInfo(weight, height, user_id)
        except Exception as e:
            print(e)
            return f'{self.exception} patinent not updated'

    def addPatientInfo(self, weight: float, height: float, patinent_id: int, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''INSERT INTO "patients_anthropometry" ("measurement_date", "weight", "height", "patient_id") VALUES (:date, :weight, :height, :patient_id) RETURNING id''')
                result = db.execute(sql, {'date': date.today(
                ), 'weight': weight, 'height': height, 'patient_id': patinent_id}).scalar()
                db.commit()
                return self.getById(user_id) if result is not None else "create patient info error"
        except Exception as e:
            print(e)
            return f'{self.exception} patient info not created'

    def updatePatientInfo(self, weight: float, height: float, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT patient_id FROM PatientsView WHERE "user_id"=:user_id''')
                patinent_id = db.execute(sql, {'user_id': user_id}).scalar()
                if patinent_id is None:
                    return None
                sql = text(
                    '''SELECT id FROM "patients_anthropometry" WHERE "patient_id"=:patinent_id''')
                result = db.execute(sql, {'patinent_id': patinent_id}).first()
                if result is None:
                    return self.addPatientInfo(weight, height, patinent_id, user_id)
                sql = text(
                    '''UPDATE "patients_anthropometry" SET "measurement_date"=:date,"weight"=:weight,"height"=:height WHERE "patient_id"=:patient_id RETURNING id;''')
                result = db.execute(sql, {'date': date.today(
                ), 'weight': weight, 'height': height, 'patient_id': patinent_id}).scalar()
                db.commit()
                return self.getById(user_id) if result is not None else 'update patient info error'
        except Exception as e:
            print(e)
            return f'{self.exception} patinent info not updated'
