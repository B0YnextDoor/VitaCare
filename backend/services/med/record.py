from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from schemas.record import MedicalRecordDb
from services.appointment.appointment import AppointmentService


class MedicalRecordService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]], appService: AppointmentService) -> None:
        self.session = session
        self.exception = "exception occured - medical record not"
        self.appService = appService

    def getAll(self):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT * FROM select_medical_records(NULL, NULL)''')
                result = db.execute(sql)
                return [MedicalRecordDb(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT * FROM select_medical_records(NULL, NULL) WHERE "record_id"=:id''')
                result = db.execute(sql, {'id': id}).first()
                return MedicalRecordDb(*result).to_dict() if result is not None else 'medical record not found'
        except Exception:
            return None

    def getByUserId(self, user_id: int, role: int = 3):
        try:
            with self.session() as db:
                sql = text(
                    f'''SELECT * FROM select_medical_records({role}, {user_id})''')
                result = db.execute(sql)
                return [MedicalRecordDb(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def create(self, diagnosis_id: int, recomendations: str, doctor_id: int, patient_id: int, app_id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT name FROM diagnosis WHERE id=:id''')
                result = db.execute(sql, {'id': diagnosis_id}).first()
                if result is None:
                    diagnosis_id = 0
                sql = text(
                    '''SELECT doctor_id FROM DoctorsView WHERE user_id=:id''')
                doctor = db.execute(sql, {'id': doctor_id}).scalar()
                if doctor is None:
                    return "doctor not found"
                sql = text(
                    '''SELECT patient_id FROM PatientsView WHERE user_id=:id''')
                patient = db.execute(sql, {'id': patient_id}).scalar()
                if patient is None:
                    return 'patient not found'
                sql = text('''INSERT INTO "medical_records" ("diagnosis_id", "conclusion_date", "recomendations", "doctor_id", "patient_id") VALUES (:diagnosis_id, CURRENT_DATE, :recomendations, :doctor_id, :patient_id) RETURNING id''')
                result = db.execute(sql, {'diagnosis_id': diagnosis_id, 'recomendations': recomendations,
                                    'doctor_id': doctor, 'patient_id': patient}).scalar()
                if result is None:
                    return 'create record error'
                app = self.appService.getById(app_id)
                if type(app) is str:
                    return app
                upd_app = self.appService.update(
                    app['id'], app['appointment_date'], app['complaints'], 2, doctor_id, 2)
                if upd_app is None or type(upd_app) is str:
                    return upd_app
                db.commit()
                return self.getByUserId(patient_id)
        except Exception as e:
            print(e)
            return f"{self.exception} created"
