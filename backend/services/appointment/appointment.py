from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable

from schemas.appointment import AppointmentDBAll, AppointmentDBId, datetime
from services.user.doctor import DoctorService
from services.user.patient import PatientService


class AppointmentService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]], patientService: PatientService, doctorService: DoctorService) -> None:
        self.session = session
        self.exception = "exception occured - appointment not"
        self.patientService = patientService
        self.doctorService = doctorService

    def getAll(self):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT * FROM select_and_check_appointments(NULL, NULL)''')
                result = db.execute(sql)
                db.commit()
                return [AppointmentDBAll(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getByUserId(self, user_id: int, role: int):
        try:
            with self.session() as db:
                sql = text(
                    f'''SELECT * FROM select_and_check_appointments({role}, {user_id})''')
                result = db.execute(sql)
                db.commit()
                return [AppointmentDBAll(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text(f'''SELECT a.id AS appointment_id, a.date AS appointment_date, a.complaints,
                           ast.id AS status_id, dv.user_id AS doctor_id, dv.user_email AS doctor_email,
                           dv.user_name AS doctor_name, dv.user_surname AS doctor_surname,
                           dv.q_name AS doctor_qualification, dv.spec_name AS doctor_specialization,
                           pv.user_id AS patient_id, pv.user_email AS patient_email,
                           pv.user_name AS patient_name, pv.user_surname AS patient_surname
                           FROM "appointments" a
                           JOIN "appointment_statuses" ast ON a.status_id = ast.id
                           JOIN DoctorsView dv ON a.doctor_id = dv.doctor_id
                           JOIN PatientsView pv ON a.patient_id = pv.patient_id
                           WHERE a.id=:id''')
                result = db.execute(sql, {'id': id}).first()
                return AppointmentDBId(*result).to_dict() if result is not None else 'appointment not found'
        except Exception:
            return f"{self.exception} found"

    def checkAppointmentDate(self, appointment_date: str, doc_id: int):
        try:
            with self.session() as db:
                sql = text(
                    f'''SELECT appointment_id FROM select_and_check_appointments(2, {doc_id}) WHERE appointment_date=:date AND status_id NOT IN (3)''')
                result = db.execute(sql, {"date": appointment_date}).first()
                return True if result is None else False
        except Exception as e:
            print(e)
            return False

    def create(self, appointment_date: datetime, complaints: str, doctor_id: int, patient_id: int):
        try:
            doctor = self.doctorService.getById(doctor_id)
            if doctor is None:
                return 'doctor not found'
            patient = self.patientService.getById(patient_id)
            if patient is None:
                return 'patient not found'
            with self.session() as db:
                sql = text('''SELECT b.patient_id, COUNT(*) as bills_count, SUM(b.value) as total_debt 
                           FROM "bills" b
                           JOIN "payment_statuses" ps ON b.payment_status_id = ps.id
                           JOIN PatientsView pv ON b.patient_id = pv.patient_id
                           WHERE ps.id = 1 AND b.patient_id=:id
                           GROUP BY b.patient_id
                           HAVING COUNT(*) > 3 OR SUM(b.value) > 500.0;''')
                check_allow = db.execute(
                    sql, {"id": patient['patient_id']}).first()
                if check_allow is not None:
                    return False
                sql = text(
                    '''SELECT "id" FROM "appointment_statuses" WHERE "name"=:status''')
                status_id = db.execute(sql, {'status': 'active'}).scalar()
                if status_id is None:
                    return 'status not found'
                sql = text('''INSERT INTO "appointments" ("date", "complaints", "status_id", "doctor_id", "patient_id") 
VALUES (:date, :complaints, :status_id, :doctor_id, :patient_id) RETURNING id''')
                result = db.execute(
                    sql, {'date': appointment_date, 'complaints': complaints, 'status_id': status_id, 'doctor_id': doctor['doctor_id'], 'patient_id': patient['patient_id']}).first()
                db.commit()
                return self.getByUserId(patient_id, 3) if result is not None else 'create appointment error'
        except Exception as e:
            print(e)
            return f"{self.exception} created"

    def update(self, id: int, appointment_date: datetime, complaints: str, status_id: int, user_id: int | None, role: int | None):
        try:
            if user_id is None or role is None:
                return "bad token"
            with self.session() as db:
                sql = text(
                    '''SELECT "id" FROM "appointment_statuses" WHERE "id"=:status_id''')
                check_status_id = db.execute(
                    sql, {'status_id': status_id}).scalar()
                if check_status_id is None:
                    return 'status not found'
                sql = text(
                    '''UPDATE "appointments" SET "date"=:date, "complaints"=:complaints,"status_id"=:status_id WHERE "id"=:id RETURNING id''')
                result = db.execute(
                    sql, {'date': appointment_date, 'complaints': complaints, 'status_id': status_id, 'id': id}).first()
                db.commit()
                return self.getByUserId(user_id, role) if result is not None else 'update appointment error'
        except Exception as e:
            print(e)
            return f"{self.exception} updated"
