from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from services.doctor.schedule import ScheduleService
from schemas.shedule import Schedule

scheduleRouter = APIRouter(prefix="/schedule", tags=["schedule"])


@scheduleRouter.get("/patterns")
@inject
async def get_skip_patterns(access_token: str | None = Cookie(default=None),
                            refresh_token: str | None = Cookie(default=None),
                            service: ScheduleService = Depends(Provide[Container.schedule_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, service.getSkipPatterns)
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@scheduleRouter.get("/id")
@inject
async def get_schedule_by_id(id: int,
                             access_token: str | None = Cookie(default=None),
                             refresh_token: str | None = Cookie(default=None),
                             service: ScheduleService = Depends(Provide[Container.schedule_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    schedule = service.getById(id)
    if schedule is None or type(schedule) is str:
        schedule = {'error': schedule}
        status_code = 400
    return returnResponse(JSONResponse, access, refresh, schedule, status_code)


@scheduleRouter.get("/")
@inject
async def get_doctor_schedule(doc_id: int,
                              all: int | None = None,
                              access_token: str | None = Cookie(default=None),
                              refresh_token: str | None = Cookie(default=None),
                              service: ScheduleService = Depends(Provide[Container.schedule_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token,  role=[1, 2, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    schedules = service.getDoctorSchedules(doc_id, all)
    if type(schedules) is str:
        schedules = {'error': schedules}
        status_code = 400
    return returnResponse(JSONResponse, access, refresh, schedules, status_code)


@scheduleRouter.get("/doc")
@inject
async def get_available_doc_time(doc_id: int,
                                 access_token: str | None = Cookie(
                                     default=None),
                                 refresh_token: str | None = Cookie(
                                     default=None),
                                 service: ScheduleService = Depends(Provide[Container.schedule_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=[1, 2, 3])
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    free_time = service.getAvailableTime(doc_id)
    if type(free_time) is str:
        free_time = {"error": free_time}
        status_code = 400
    return returnResponse(JSONResponse, access, refresh, free_time, status_code)


@scheduleRouter.post("/")
@inject
async def create_schedule(data: Schedule,
                          access_token: str | None = Cookie(default=None),
                          refresh_token: str | None = Cookie(default=None),
                          service: ScheduleService = Depends(Provide[Container.schedule_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    new_schedule = service.createSchedule(
        data.start_time, data.end_time, data.pattern, data.doctor_id)
    if type(new_schedule) is str:
        status_code = 400
        new_schedule = {"error": new_schedule}
    return returnResponse(JSONResponse, access, refresh, new_schedule, status_code)


@scheduleRouter.put("/")
@inject
async def update_schedule(id: int,
                          data: Schedule,
                          access_token: str | None = Cookie(default=None),
                          refresh_token: str | None = Cookie(default=None),
                          service: ScheduleService = Depends(Provide[Container.schedule_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    upd_schedule = service.updateSchedule(
        data.start_time, data.end_time, data.pattern, id)
    if type(upd_schedule) is str:
        status_code = 400
        upd_schedule = {"error": upd_schedule}
    return returnResponse(JSONResponse, access, refresh, upd_schedule, status_code)


@scheduleRouter.delete("/")
@inject
async def delete_schedule(id: int,
                          access_token: str | None = Cookie(default=None),
                          refresh_token: str | None = Cookie(default=None),
                          service: ScheduleService = Depends(Provide[Container.schedule_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token)
    if status_code > 400:
        return returnResponse(JSONResponse, access, refresh, content, status_code)
    del_schedule = service.deleteSchedule(id)
    if type(del_schedule) is str:
        status_code = 400
        del_schedule = {"error": del_schedule}
    return returnResponse(JSONResponse, access, refresh, del_schedule, status_code)
