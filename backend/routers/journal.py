from fastapi import APIRouter, Depends, Cookie
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from services.journal.journal import LogActionService

journalRouter = APIRouter(prefix="/logs", tags=["log actions"])


@journalRouter.get("/")
@inject
async def get_actions(access_token: str | None = Cookie(default=None),
                      refresh_token: str | None = Cookie(default=None),
                      service: LogActionService = Depends(Provide[Container.log_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, service.getAll)
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@journalRouter.get("/")
@inject
async def get_actions_by_type(type_id: int,
                              access_token: str | None = Cookie(
                                  default=None),
                              refresh_token: str | None = Cookie(
                                  default=None),
                              service: LogActionService = Depends(Provide[Container.log_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _: service.getByActionTypeId(type_id))
    return returnResponse(JSONResponse, access, refresh, content, status_code)


@journalRouter.get("/user")
@inject
async def get_user_actions(user_id: int,
                           access_token: str | None = Cookie(
                               default=None),
                           refresh_token: str | None = Cookie(
                               default=None),
                           service: LogActionService = Depends(Provide[Container.log_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _: service.getByUserId(user_id))
    return returnResponse(JSONResponse, access, refresh, content, status_code)
