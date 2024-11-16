from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from services.user.user import UserService

patientRouter = APIRouter(prefix="/patients", tags=["patient"])


@patientRouter.get("/")
@inject
async def get_patients(access_token: str | None = Cookie(default=None),
                       refresh_token: str | None = Cookie(default=None),
                       service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, service.getPatients, [1])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@patientRouter.get("/id")
@inject
async def get_patient_by_id(id: int,
                            access_token: str | None = Cookie(default=None),
                            refresh_token: str | None = Cookie(default=None),
                            service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    patient = service.getUserById(id, 3)
    if patient is None or type(patient) is str:
        status_code = 400
        patient = {"error": patient}
    return returnResponse(JSONResponse, access, refresh, patient, status_code)
