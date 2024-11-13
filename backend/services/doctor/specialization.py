from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable

from schemas.user import DoctorSpecializationDB


class SpecializationService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = "exception occured - specialization not"

    def getAll(self):
        try:
            with self.session() as db:
                sql = text('''SELECT * FROM "doctor_specializations"''')
                result = db.execute(sql)
                return [DoctorSpecializationDB(*rec).to_dict() for rec in result]
        except Exception as e:
            print(e)
            return None

    def create(self, name: str, description: str, service_fee: float):
        try:
            with self.session() as db:
                sql = text('''INSERT INTO "doctor_specializations" ("name", "description", "service_fee") 
    VALUES (:name, :description, :service_fee) RETURNING *''')
                result = db.execute(
                    sql, {'name': name, 'description': description, 'service_fee': service_fee}).first()
                db.commit()
                return DoctorSpecializationDB(*result).to_dict() if result is not None else 'spec create error'
        except Exception:
            return f"{self.exception} created"

    def update(self, name: str, description: str, service_fee: float, id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''UPDATE "doctor_specializations" SET "name"=:name,"description":=description,"service_fee"=:service_fee WHERE "id"=:id RETURNING *''')
                result = db.execute(
                    sql, {'name': name, 'description': description, 'service_fee': service_fee, 'id': id}).first()
                db.commit()
                return DoctorSpecializationDB(*result).to_dict() if result is not None else 'spec update error'
        except:
            return f"{self.exception} updated"

    def delete(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''DELETE FROM "doctor_specializations" WHERE "id"=:id RETURNING *''')
                result = db.execute(sql, {'id': id}).first()
                db.commit()
                return DoctorSpecializationDB(*result).to_dict() if result is not None else 'spec delete error'
        except Exception:
            return f"{self.exception} deleted"
