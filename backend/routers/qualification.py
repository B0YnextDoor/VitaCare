from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from schemas.user import Qualification
from services.doctor.qualification import QualificationService

qualRouter = APIRouter(prefix="/qualification", tags=["qualification"])


@qualRouter.get("/")
@inject
async def get_qualifications(
        access_token: str | None = Cookie(default=None),
        refresh_token: str | None = Cookie(default=None),
        service: QualificationService = Depends(Provide[Container.qual_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.getAll(), [1, 2, 3])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@qualRouter.post("/")
@inject
async def create_qualification(data: Qualification,
                               access_token: str | None = Cookie(default=None),
                               refresh_token: str | None = Cookie(
                                   default=None),
                               service: QualificationService = Depends(Provide[Container.qual_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_q = service.create(data.q_name, data.q_mult)
    if type(new_q) is str:
        status_code = 400
        new_q = {"error": new_q}
    return returnResponse(JSONResponse, access, refresh, new_q, status_code)


@qualRouter.put("/")
@inject
async def update_qualification(id: int,
                               data: Qualification,
                               access_token: str | None = Cookie(default=None),
                               refresh_token: str | None = Cookie(
                                   default=None),
                               service: QualificationService = Depends(Provide[Container.qual_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    upd_q = service.update(data.q_name, data.q_mult, id)
    if type(upd_q) is str:
        status_code = 400
        upd_q = {"error": upd_q}
    return returnResponse(JSONResponse, access, refresh, upd_q, status_code)


@qualRouter.delete("/")
@inject
async def create_qualification(id: int,
                               access_token: str | None = Cookie(default=None),
                               refresh_token: str | None = Cookie(
                                   default=None),
                               service: QualificationService = Depends(Provide[Container.qual_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    del_q = service.delete(id)
    if type(del_q) is str:
        status_code = 400
        del_q = {"error": del_q}
    return returnResponse(JSONResponse, access, refresh, del_q, status_code)
