from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from services.med.record import MedicalRecordService
from schemas.record import Record


recordRouter = APIRouter(prefix="/record", tags=["medical records"])


@recordRouter.get("/")
@inject
async def get_medical_records(access_token: str | None = Cookie(default=None),
                              refresh_token: str | None = Cookie(default=None),
                              service: MedicalRecordService = Depends(Provide[Container.record_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _: service.getAll())
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@recordRouter.get("/id")
@inject
async def get_record_by_id(id: int,
                           access_token: str | None = Cookie(default=None),
                           refresh_token: str | None = Cookie(default=None),
                           service: MedicalRecordService = Depends(Provide[Container.record_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    record = service.getById(id)
    if record is None or type(record) is str:
        status_code = 400
        record = {"error": record}
    return returnResponse(JSONResponse, access, refresh, record, status_code)


@recordRouter.get("/user")
@inject
async def get_user_records(id: int | None = None,
                           type: int | None = None,
                           access_token: str | None = Cookie(default=None),
                           refresh_token: str | None = Cookie(default=None),
                           service: MedicalRecordService = Depends(Provide[Container.record_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=None)
    if status_code is not None:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    role = int(content['role'])
    if id is None:
        id = content['user']
        role = role if role == 3 else 1
    else:
        role = 3 if type is None else type
    records = service.getByUserId(id, role)
    return returnResponse(JSONResponse, access, refresh, records)


@recordRouter.post("/")
@inject
async def create_medical_record(record: Record,
                                access_token: str | None = Cookie(
                                    default=None),
                                refresh_token: str | None = Cookie(
                                    default=None),
                                service: MedicalRecordService = Depends(Provide[Container.record_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[2])
    print(content)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_record = service.create(
        record.diagnosis_id, record.recomendations, int(content['user']), record.patient_id, record.app_id)
    if new_record is None or type(new_record) is str:
        status_code = 400
        new_record = {"error": new_record}
    return returnResponse(JSONResponse, access, refresh, new_record, status_code)
