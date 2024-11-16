from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from services.appointment.appointment import AppointmentService
from schemas.appointment import Appointment, AppointmentCheck


appointmentRouter = APIRouter(prefix="/appointment", tags=["appointment"])


@appointmentRouter.get("/")
@inject
async def get_appointments(access_token: str | None = Cookie(default=None),
                           refresh_token: str | None = Cookie(default=None),
                           service: AppointmentService = Depends(Provide[Container.app_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.getAll())
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@appointmentRouter.get("/id")
@inject
async def get_appointment_by_id(id: int,
                                access_token: str | None = Cookie(
                                    default=None),
                                refresh_token: str | None = Cookie(
                                    default=None),
                                service: AppointmentService = Depends(Provide[Container.app_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    app = service.getById(id)
    if app is None or type(app) is str:
        status_code = 400
        app = {"error": app}
    return returnResponse(JSONResponse, access, refresh, app, status_code)


@appointmentRouter.get("/user")
@inject
async def get_user_appointments(id: int | None = None,
                                access_token: str | None = Cookie(
                                    default=None),
                                refresh_token: str | None = Cookie(
                                    default=None),
                                service: AppointmentService = Depends(Provide[Container.app_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=None)
    if status_code is not None and status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    role = int(content['role'])
    if role != 1:
        id = content['user']
    apps = service.getByUserId(id, role)
    return returnResponse(JSONResponse, access, refresh, apps)


@appointmentRouter.post("/")
@inject
async def create_appointment(data: Appointment,
                             access_token: str | None = Cookie(
                                 default=None),
                             refresh_token: str | None = Cookie(
                                 default=None),
                             service: AppointmentService = Depends(Provide[Container.app_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    check = service.checkAppointmentDate(str(data.date), data.user_id)
    if (check == False):
        return returnResponse(JSONResponse, access, refresh, {"error": "Time is already booked!"}, 418)
    new_app = service.create(
        data.date, data.complaints, data.user_id, int(content['user']))
    if new_app is None or type(new_app) is str:
        status_code = 400
        new_app = {"error": new_app}
    elif new_app == False:
        status_code = 418
        new_app = {"error": "Too many unpaid appointments"}
    return returnResponse(JSONResponse, access, refresh, new_app, status_code)


@appointmentRouter.put("/")
@inject
async def update_appointment(id: int, data: Appointment,
                             access_token: str | None = Cookie(
                                 default=None),
                             refresh_token: str | None = Cookie(
                                 default=None),
                             service: AppointmentService = Depends(Provide[Container.app_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[2, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    check = service.checkAppointmentDate(
        str(data.date), data.user_id) if data.user_id is not None else True
    if (check == False):
        return returnResponse(JSONResponse, access, refresh, {"error": "Time is already booked!"}, 418)
    upd_app = service.update(id, data.date, data.complaints,
                             data.status_id, content.get('user'), content.get('role'))
    if upd_app is None or type(upd_app) is str:
        status_code = 400
        upd_app = {"error": upd_app}
    return returnResponse(JSONResponse, access, refresh, upd_app, status_code)


@appointmentRouter.post("/check")
@inject
async def check_appointment_date(data: AppointmentCheck,
                                 access_token: str | None = Cookie(
                                     default=None),
                                 refresh_token: str | None = Cookie(
                                     default=None),
                                 service: AppointmentService = Depends(Provide[Container.app_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.checkAppointmentDate(str(data.date), data.user_id), [3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    if content == False:
        content = {"error": "Time is already booked!"}
        status_code = 400
    return returnResponse(JSONResponse, access, refresh, content, status_code)
