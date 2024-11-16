from dependency_injector import containers, providers
from core.db import Database
from core.config import config
from services.auth.auth import AuthService
from services.auth.token import TokenService
from services.user.doctor import DoctorService
from services.user.patient import PatientService
from services.user.user import UserService
from services.med.disgnosis import DiagnosisService
from services.med.record import MedicalRecordService
from services.med.medication import MedicationService
from services.med.prescription import PrescriptionService
from services.doctor.qualification import QualificationService
from services.doctor.schedule import ScheduleService
from services.doctor.specialization import SpecializationService
from services.appointment.appointment import AppointmentService
from services.journal.journal import LogActionService
from services.bill.bill import BillService


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            'middleware.user',
            'routers.auth',
            'routers.user',
            'routers.bill',
            'routers.record',
            'routers.doctor',
            'routers.journal',
            'routers.patient',
            'routers.schedule',
            'routers.diagnosis',
            'routers.medication',
            'routers.appointment',
            'routers.prescription',
            'routers.qualification',
            'routers.specialization'
        ])

    db = providers.Singleton(Database, db_url=config.DATABASE_URL)

    token_service = providers.Singleton(TokenService)

    doctor_service = providers.Singleton(
        DoctorService, session=db.provided.session)

    patient_service = providers.Singleton(
        PatientService, session=db.provided.session)

    qual_service = providers.Singleton(
        QualificationService, session=db.provided.session)

    spec_service = providers.Singleton(
        SpecializationService, session=db.provided.session)

    schedule_service = providers.Singleton(
        ScheduleService, session=db.provided.session)

    diagnosis_service = providers.Singleton(
        DiagnosisService, session=db.provided.session)

    medication_service = providers.Singleton(
        MedicationService, session=db.provided.session)

    app_service = providers.Singleton(
        AppointmentService, session=db.provided.session, patientService=patient_service.provided, doctorService=doctor_service.provided)

    prescr_service = providers.Singleton(
        PrescriptionService, session=db.provided.session)

    record_service = providers.Singleton(
        MedicalRecordService, session=db.provided.session, appService=app_service.provided)

    log_service = providers.Singleton(
        LogActionService, session=db.provided.session)

    bill_service = providers.Singleton(
        BillService, session=db.provided.session)

    user_service = providers.Singleton(
        UserService, session=db.provided.session, doctorService=doctor_service.provided,
        patientService=patient_service.provided)

    auth_service = providers.Singleton(
        AuthService, session=db.provided.session, userService=user_service.provided, tokenService=token_service.provided)
