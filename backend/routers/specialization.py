from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from schemas.user import Specialization
from services.doctor.specialization import SpecializationService

specRouter = APIRouter(prefix="/specialization", tags=["specialization"])


@specRouter.get("/")
@inject
async def get_specializations(
        access_token: str | None = Cookie(default=None),
        refresh_token: str | None = Cookie(default=None),
        service: SpecializationService = Depends(Provide[Container.spec_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, service.getAll, [1, 2, 3])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@specRouter.post("/")
@inject
async def create_specialization(data: Specialization,
                                access_token: str | None = Cookie(
                                    default=None),
                                refresh_token: str | None = Cookie(
                                    default=None),
                                service: SpecializationService = Depends(Provide[Container.spec_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_spec = service.create(
        data.spec_name, data.spec_descr, data.service_fee)
    if type(new_spec) is str:
        status_code = 400
        new_spec = {"error": new_spec}
    return returnResponse(JSONResponse, access, refresh, new_spec, status_code)


@specRouter.put("/")
@inject
async def update_specialization(id: int,
                                data: Specialization,
                                access_token: str | None = Cookie(
                                    default=None),
                                refresh_token: str | None = Cookie(
                                    default=None),
                                service: SpecializationService = Depends(Provide[Container.spec_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    upd_spec = service.update(
        data.spec_name, data.spec_descr, data.service_fee, id)
    if type(upd_spec) is str:
        status_code = 400
        upd_spec = {"error": upd_spec}
    return returnResponse(JSONResponse, access, refresh, upd_spec, status_code)


@specRouter.delete("/")
@inject
async def delete_specialization(id: int,
                                access_token: str | None = Cookie(
                                    default=None),
                                refresh_token: str | None = Cookie(
                                    default=None),
                                service: SpecializationService = Depends(Provide[Container.spec_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    del_spec = service.delete(id)
    if type(del_spec) is str:
        status_code = 400
        del_spec = {"error": del_spec}
    return returnResponse(JSONResponse, access, refresh, del_spec, status_code)
