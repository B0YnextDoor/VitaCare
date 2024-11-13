from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from schemas.bill import Bill


class BillService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]):
        self.session = session

    def getAll(self):
        try:
            with self.session() as db:
                sql = text('''SELECT b.id AS bill_id, b.value AS bill_amount, b.invoice_date, ps.id AS payment_status_id, ps.name AS payment_status, pv.user_id, pv.user_email AS patient_email, pv.user_name AS patient_name, pv.user_surname AS patient_surname
                           FROM "bills" b
                           JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
                           JOIN PatientsView pv ON b.patient_id = pv.patient_id
                           ORDER BY payment_status_id ASC;''')
                result = db.execute(sql)
                return [Bill(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT b.id AS bill_id, b.value AS bill_amount, b.invoice_date, ps.id AS payment_status_id, ps.name AS payment_status, pv.user_id, pv.user_email AS patient_email, pv.user_name AS patient_name, pv.user_surname AS patient_surname
                           FROM "bills" b
                           JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
                           JOIN PatientsView pv ON b.patient_id = pv.patient_id
                           WHERE b.id=:id''')
                result = db.execute(sql, {"id": id}).first()
                return Bill(*result).to_dict() if result is not None else None
        except Exception:
            return None

    def getByStatusId(self, id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT b.id AS bill_id, b.value AS bill_amount, b.invoice_date, ps.id AS payment_status_id, ps.name AS payment_status, pv.user_id, pv.user_email AS patient_email, pv.user_name AS patient_name, pv.user_surname AS patient_surname
                           FROM "bills" b
                           JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
                           JOIN PatientsView pv ON b.patient_id = pv.patient_id
                           WHERE ps.id=:id''')
                result = db.execute(sql, {"id": id})
                return [Bill(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getByUserId(self, id: int):
        try:
            with self.session() as db:
                sql = text(
                    f'''SELECT "id" FROM "patients" WHERE "user_id"={id}''')
                patient_id = db.execute(sql).scalar()
                if (patient_id is None):
                    return "user not found"
                sql = text('''SELECT b.id AS bill_id, b.value AS bill_amount, b.invoice_date, ps.id AS payment_status_id, ps.name AS payment_status, pv.user_id, pv.user_email AS patient_email, pv.user_name AS patient_name, pv.user_surname AS patient_surname
                           FROM "bills" b
                           JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
                           JOIN PatientsView pv ON b.patient_id = pv.patient_id
                           WHERE pv.user_id=:id
                           ORDER BY invoice_date DESC, payment_status_id ASC''')
                result = db.execute(sql, {"id": id})
                return [Bill(*rec).to_dict() for rec in result]
        except Exception as e:
            print(e)
            return None

    def update(self, id: int, status_id: int):
        try:
            with self.session() as db:
                sql = text(
                    f'''UPDATE "bills" SET "payment_status_id"=:status_id WHERE "id"=:id RETURNING id''')
                result = db.execute(
                    sql, {"id": id, "status_id": status_id}).first()
                db.commit()
                return self.getById(id) if result is not None else "bill update error"
        except Exception:
            return "exception occured - bill status not updated"
