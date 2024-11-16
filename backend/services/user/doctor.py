from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from schemas.user import Doctor, DoctorShort


class DoctorService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = "exception occured - doctor not"

    def getAll(self):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT dv.user_id, dv.user_email, dv.user_name, dv.user_surname, dv.q_name, dv.spec_name FROM DoctorsView dv''')
                result = db.execute(sql)
                return [DoctorShort(rec[0], 2, *rec[1:]).to_dict() for rec in result]
        except Exception as e:
            print(e)
            return None

    def getByShedule(self, pattern_id: int):
        try:
            with self.session() as db:
                sql = text(f'''SELECT dv.user_id, dv.user_email, dv.user_name, dv.user_surname, dv.q_name, dv.spec_name
                           FROM "doctors_schedules" ds
                           JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
                           JOIN DoctorsView dv ON ds.doctor_id = dv.doctor_id 
                           WHERE ds.skip_days_pattern_id:=pattern_id''')
                result = db.execute(sql, {'pattern_id': pattern_id})
                return [DoctorShort(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT dv.user_id, dv.user_email, dv.user_name, dv.user_surname, dv.doctor_id, dv.q_id, dv.q_name, dv.q_mult, dv.spec_id, dv.spec_name, dv.spec_desc, dv.service_fee FROM DoctorsView dv WHERE dv.user_id=:id''')
                result = db.execute(sql, {"id": id}).first()
                return Doctor(result[0], 2, *result[1:]).to_dict() if result is not None else result
        except Exception:
            return None

    def createDoctor(self, qualification_id: int, specialization_id: int, user_id: int):
        try:
            with self.session() as db:
                sql = text('''INSERT INTO "doctors" ("qualification_id", "user_id", "specialization_id") 
    VALUES (:qualification_id, :user_id, :specialization_id) RETURNING id''')
                result = db.execute(sql, {'qualification_id': qualification_id,
                                    'user_id': user_id, 'specialization_id': specialization_id}).scalar()
                db.commit()
                return self.getById(user_id) if result is not None else 'doctor create error'
        except Exception:
            return f"{self.exception} created"

    def updateDoctor(self, qualification_id: int, specialization_id: int, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''UPDATE "doctors" SET "qualification_id"=:qualification_id,"specialization_id"=:specialization_id WHERE "user_id"=:user_id RETURNING id''')
                result = db.execute(sql, {'qualification_id': qualification_id,
                                    'specialization_id': specialization_id, 'user_id': user_id}).scalar()
                db.commit()
                return self.getById(user_id) if result is not None else 'doctor update error'
        except Exception:
            return f"{self.exception} updated"
