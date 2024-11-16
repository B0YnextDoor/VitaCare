from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable

from schemas.prescription import PrescriptionDb


class PrescriptionService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = "exception occured - prescription not"

    def getAll(self):
        try:
            with self.session() as db:
                sql = text('''SELECT p.id AS prescription_id, p.dosage, p.issue_date, m.id AS medication_id, m.name AS medication_name, p.medical_record_id FROM "prescriptions" p JOIN "medications" m ON p.medication_id = m.id''')
                result = db.execute(sql)
                return [PrescriptionDb(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getByRecord(self, record_id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT p.id AS prescription_id, p.dosage, p.issue_date, m.id AS medication_id, m.name AS medication_name, p.medical_record_id FROM "prescriptions" p JOIN "medications" m ON p.medication_id = m.id WHERE p.medical_record_id=:record_id''')
                result = db.execute(sql, {'record_id': record_id})
                return [PrescriptionDb(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def create(self, dosage: float, medication_id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT "id" FROM "medications" WHERE "id"=:id''')
                result = db.execute(sql, {'id': medication_id}).scalar()
                if result is None:
                    return "medication not found"
                sql = text('''SELECT COUNT(*) FROM "medical_records"''')
                record_id = db.execute(sql).scalar()
                if record_id is None:
                    return f"{self.exception} created"
                record_id += 1
                sql = text(
                    '''INSERT INTO "prescriptions" ("dosage", "issue_date", "medication_id", "medical_record_id") VALUES (:dosage, CURRENT_DATE, :medication_id, :record_id) RETURNING id''')
                result = db.execute(
                    sql, {'dosage': dosage, 'medication_id': medication_id, 'record_id': record_id}).scalar()
                db.commit()
                return {'message': "created"} if result is not None else "presciption create error"
        except Exception as e:
            print(e)
            return f"{self.exception} created"
