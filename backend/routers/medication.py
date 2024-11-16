from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from schemas.medication import Medication
from services.med.medication import MedicationService


medRouter = APIRouter(prefix="/medication", tags=["medication"])


@medRouter.get("/")
@inject
async def get_medications(access_token: str | None = Cookie(default=None),
                          refresh_token: str | None = Cookie(default=None),
                          service: MedicationService = Depends(Provide[Container.medication_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.getAll(), role=[1, 2])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@medRouter.get("/id")
@inject
async def get_medication_by_id(id: int,
                               access_token: str | None = Cookie(default=None),
                               refresh_token: str | None = Cookie(
                                   default=None),
                               service: MedicationService = Depends(Provide[Container.medication_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    medication = service.getById(id)
    if medication is None or type(medication) is str:
        status_code = 400
        medication = {"error": medication}
    return returnResponse(JSONResponse, access, refresh, medication, status_code)


@medRouter.post("/")
@inject
async def create_medication(data: Medication,
                            access_token: str | None = Cookie(default=None),
                            refresh_token: str | None = Cookie(default=None),
                            service: MedicationService = Depends(Provide[Container.medication_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_med = service.create(data.name, data.description, data.price)
    if type(new_med) is str:
        status_code = 400
        new_med = {"error": new_med}
    return returnResponse(JSONResponse, access, refresh, new_med, status_code)


@medRouter.put("/")
@inject
async def update_medication(id: int, data: Medication,
                            access_token: str | None = Cookie(default=None),
                            refresh_token: str | None = Cookie(default=None),
                            service: MedicationService = Depends(Provide[Container.medication_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    upd_med = service.update(id, data.name, data.description, data.price)
    if type(upd_med) is str:
        status_code = 400
        upd_med = {"error": upd_med}
    return returnResponse(JSONResponse, access, refresh, upd_med, status_code)


@medRouter.delete("/")
@inject
async def delete_medication(id: int,
                            access_token: str | None = Cookie(default=None),
                            refresh_token: str | None = Cookie(default=None),
                            service: MedicationService = Depends(Provide[Container.medication_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    del_med = service.delete(id)
    if type(del_med) is str:
        status_code = 400
        del_med = {"error": del_med}
    return returnResponse(JSONResponse, access, refresh, del_med, status_code)
