from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from schemas.diagnosis import DiagnosisDb


class DiagnosisService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = "exception occured - diagnosis not"

    def getAll(self):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT "id", "name", "description" FROM "diagnosis" ORDER BY "name"''')
                result = db.execute(sql)
                return [DiagnosisDb(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    f'''SELECT "id", "name", "description" FROM "diagnosis" WHERE "id"={id}''')
                result = db.execute(sql).first()
                return DiagnosisDb(*result).to_dict() if result is not None else 'diagnosis not found'
        except Exception:
            return None

    def create(self, name: str, description: str):
        try:
            with self.session() as db:
                sql = text(
                    '''INSERT INTO "diagnosis" ("name", "description") VALUES (:name, :description) RETURNING *''')
                result = db.execute(
                    sql, {"name": name, "description": description}).first()
                db.commit()
                return DiagnosisDb(*result).to_dict() if result is not None else 'diagnosis create error'
        except Exception as e:
            print(e)
            return f"{self.exception} created"

    def update(self, id: int, name: str, description: str):
        try:
            with self.session() as db:
                sql = text('''UPDATE "diagnosis" SET "name"=:name,"description"=:description
                           WHERE "id"=:id RETURNING *''')
                result = db.execute(
                    sql, {'id': id, 'name': name, "description": description}).first()
                db.commit()
                return DiagnosisDb(*result).to_dict() if result is not None else 'diagnosis update error'
        except Exception:
            return f"{self.exception} updated"

    def delete(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''DELETE FROM "diagnosis" WHERE "id"=:id RETURNING *''')
                result = db.execute(sql, {"id": id}).first()
                db.commit()
                return DiagnosisDb(*result).to_dict() if result is not None else 'diagnosis delete error'
        except Exception:
            return f"{self.exception} deleted"
