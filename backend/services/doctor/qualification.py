from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable

from schemas.user import DoctorQualificationDB


class QualificationService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = "exception occured - qualification not"

    def getAll(self):
        try:
            with self.session() as db:
                sql = text('''SELECT * FROM "doctor_qualifications"''')
                result = db.execute(sql)
                return [DoctorQualificationDB(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def create(self, name: str, multiplier: float):
        try:
            with self.session() as db:
                sql = text('''INSERT INTO "doctor_qualifications" ("name", "multiplier") 
    VALUES (:name, :multiplier) RETURNING *''')
                result = db.execute(
                    sql, {'name': name, 'multiplier': multiplier}).first()
                db.commit()
                return DoctorQualificationDB(*result).to_dict() if result is not None else "qual create error"
        except Exception:
            return f"{self.exception} created"

    def update(self, name: str, multiplier: float, id: int):
        try:
            with self.session() as db:
                sql = text('''UPDATE "doctor_qualifications" SET "name"=:name,"multiplier"=:multiplier
    WHERE "id"=:id RETURNING *''')
                result = db.execute(
                    sql, {'name': name, 'multiplier': multiplier, 'id': id}).first()
                db.commit()
                return DoctorQualificationDB(*result).to_dict() if result is not None else 'qual update error'
        except Exception:
            return f"{self.exception} updated"

    def delete(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''DELETE FROM "doctor_qualifications" WHERE "id"=:id RETURNING *''')
                result = db.execute(sql, {"id": id}).first()
                db.commit()
                return DoctorQualificationDB(*result).to_dict() if result is not None else 'qual delete error'
        except Exception:
            return f"{self.exception} deleted"
