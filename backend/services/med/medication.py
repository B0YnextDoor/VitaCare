from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from schemas.medication import MedicationDB


class MedicationService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = 'exception occured - medication not'

    def getAll(self):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT "id", "name", "description", "price" FROM "medications" ORDER BY "name"''')
                result = db.execute(sql)
                return [MedicationDB(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    f'''SELECT "id", "name", "description", "price" FROM "medications" WHERE "id"={id}''')
                result = db.execute(sql).first()
                return MedicationDB(*result).to_dict() if result is not None else 'medication not found'
        except Exception:
            return None

    def create(self, name: str, description: str, price: float):
        try:
            with self.session() as db:
                sql = text(
                    '''INSERT INTO "medications" ("name", "description", "price") VALUES (:name, :description, :price) RETURNING *''')
                result = db.execute(
                    sql, {'name': name, 'description': description, 'price': price}).first()
                db.commit()
                return MedicationDB(*result).to_dict() if result is not None else 'create medication error'
        except Exception:
            return f'{self.exception} created'

    def update(self, id: int, name: str, description: str, price: float):
        try:
            with self.session() as db:
                sql = text(
                    '''UPDATE "medications" SET "name"=:name, "description"=:description,"price"=:price WHERE "id"=:id RETURNING *''')
                result = db.execute(
                    sql, {'name': name, 'description': description, 'price': price, 'id': id}).first()
                db.commit()
                return MedicationDB(*result).to_dict() if result is not None else 'update medication error'
        except Exception:
            return f"{self.exception} updated"

    def delete(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''DELETE FROM "medications" WHERE "id"=:id RETURNING *''')
                result = db.execute(sql, {'id': id}).first()
                db.commit()
                return MedicationDB(*result).to_dict() if result is not None else 'delete medication error'
        except Exception:
            return f"{self.exception} deleted"
