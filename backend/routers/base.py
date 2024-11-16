from fastapi import APIRouter
from routers.auth import authRouter
from routers.user import userRouter
from routers.bill import billRouter
from routers.doctor import doctorRouter
from routers.record import recordRouter
from routers.medication import medRouter
from routers.patient import patientRouter
from routers.journal import journalRouter
from routers.schedule import scheduleRouter
from routers.qualification import qualRouter
from routers.prescription import prescRouter
from routers.diagnosis import diagnosisRouter
from routers.specialization import specRouter
from routers.appointment import appointmentRouter

routers = [authRouter, userRouter, doctorRouter, patientRouter, qualRouter, specRouter, scheduleRouter,
           diagnosisRouter, medRouter, prescRouter, recordRouter, appointmentRouter, journalRouter, billRouter]

handler = APIRouter()

for router in routers:
    handler.include_router(router)
