from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from schemas.auth import DoctorSignUp, DoctorUpdate
from services.user.doctor import DoctorService
from services.user.user import UserService

doctorRouter = APIRouter(prefix="/doctor", tags=["doctor"])


@doctorRouter.get("/")
@inject
async def get_doctors(access_token: str | None = Cookie(default=None),
                      refresh_token: str | None = Cookie(default=None),
                      service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, service.getDoctors, [1, 3])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@doctorRouter.get("/id")
@inject
async def get_doctor_by_id(id: int,
                           access_token: str | None = Cookie(default=None),
                           refresh_token: str | None = Cookie(default=None),
                           service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.getUserById(id, 2), role=[1, 2, 3])
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@doctorRouter.post("/")
@inject
async def create_doctor(data: DoctorSignUp,
                        access_token: str | None = Cookie(default=None),
                        refresh_token: str | None = Cookie(default=None),
                        service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_doc = service.createDoctor(data)
    if new_doc is None or type(new_doc) is str:
        new_doc = {"error": new_doc}
        status_code = 400
    returnResponse(JSONResponse, access, refresh, new_doc, status_code)


@doctorRouter.put("/")
@inject
async def update_doctor(id: int,
                        data: DoctorUpdate,
                        access_token: str | None = Cookie(default=None),
                        refresh_token: str | None = Cookie(default=None),
                        service: DoctorService = Depends(Provide[Container.doctor_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    upd_doc = service.updateDoctor(
        data.qualification_id, data.specialization_id, id)
    if upd_doc is None or type(upd_doc) is str:
        upd_doc = {"error": upd_doc}
        status_code = 400
    returnResponse(JSONResponse, access, refresh, upd_doc, status_code)
