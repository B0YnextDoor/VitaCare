from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from schemas.diagnosis import Diagnosis
from services.med.disgnosis import DiagnosisService


diagnosisRouter = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@diagnosisRouter.get("/")
@inject
async def get_diagnosis(access_token: str | None = Cookie(default=None),
                        refresh_token: str | None = Cookie(default=None),
                        service: DiagnosisService = Depends(Provide[Container.diagnosis_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.getAll(), role=[1, 2])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@diagnosisRouter.get("/id")
@inject
async def get_diagnosis_by_id(id: int,
                              access_token: str | None = Cookie(default=None),
                              refresh_token: str | None = Cookie(default=None),
                              service: DiagnosisService = Depends(Provide[Container.diagnosis_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    diagnosis = service.getById(id)
    if diagnosis is None or type(diagnosis) is str:
        status_code = 400
        diagnosis = {"error": diagnosis}
    return returnResponse(JSONResponse, access, refresh, diagnosis, status_code)


@diagnosisRouter.post("/")
@inject
async def create_diagnosis(data: Diagnosis,
                           access_token: str | None = Cookie(default=None),
                           refresh_token: str | None = Cookie(default=None),
                           service: DiagnosisService = Depends(Provide[Container.diagnosis_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_diagnosis = service.create(data.name, data.description)
    if type(new_diagnosis) is str:
        status_code = 400
        new_diagnosis = {"error": new_diagnosis}
    return returnResponse(JSONResponse, access, refresh, new_diagnosis, status_code)


@diagnosisRouter.put("/")
@inject
async def update_diagnosis(id: int, data: Diagnosis,
                           access_token: str | None = Cookie(default=None),
                           refresh_token: str | None = Cookie(default=None),
                           service: DiagnosisService = Depends(Provide[Container.diagnosis_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    upd_diagnosis = service.update(id, data.name, data.description)
    if type(upd_diagnosis) is str:
        status_code = 400
        upd_diagnosis = {"error": upd_diagnosis}
    return returnResponse(JSONResponse, access, refresh, upd_diagnosis, status_code)


@diagnosisRouter.delete("/")
@inject
async def delete_diagnosis(id: int,
                           access_token: str | None = Cookie(default=None),
                           refresh_token: str | None = Cookie(default=None),
                           service: DiagnosisService = Depends(Provide[Container.diagnosis_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    del_diagnosis = service.delete(id)
    if type(del_diagnosis) is str:
        status_code = 400
        del_diagnosis = {"error": del_diagnosis}
    return returnResponse(JSONResponse, access, refresh, del_diagnosis, status_code)
