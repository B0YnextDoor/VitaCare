from fastapi import APIRouter, Depends, Cookie, Body, HTTPException
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import checkRole, returnResponse
from services.user.user import UserService
from schemas.auth import PatientUpdate, UserSignUp
from middleware.profile import Dict, Any, parse_profile


userRouter = APIRouter(prefix="/user", tags=["user"])


@userRouter.get("/profile")
@inject
async def get_profile(access_token: str | None = Cookie(default=None),
                      refresh_token: str | None = Cookie(default=None),
                      service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=None)
    if status_code is not None:
        return JSONResponse(status_code=status_code, content=content)
    profile = service.getUserById(content.get('user'), content.get('role'))
    status_code = 200
    if profile is None or type(profile) is str:
        status_code = 404
        profile = {"error": profile}
    return returnResponse(JSONResponse, access, refresh, profile, status_code)


@userRouter.put("/update-profile")
@inject
async def update_profile(data: Dict[str, Any] = Body(...),
                         access_token: str | None = Cookie(default=None),
                         refresh_token: str | None = Cookie(default=None),
                         service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, role=None)
    if status_code is not None:
        return JSONResponse(status_code=status_code, content=content)
    print(data)
    try:
        data = parse_profile(data)
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"detail": e.detail})
    profile = service.updateProfile(
        data, content.get('user'), content.get('role'))
    status_code = 200
    if profile is None or type(profile) is str:
        status_code = 400
        profile = {"error": profile}
    return returnResponse(JSONResponse, access, refresh, profile, status_code)


@userRouter.delete("/")
@inject
async def delete_user(id: int,
                      access_token: str | None = Cookie(default=None),
                      refresh_token: str | None = Cookie(default=None),
                      service: UserService = Depends(Provide[Container.user_service])):
    status_code, content, access, refresh = checkRole(
        access_token, refresh_token, lambda _=None: service.deleteUser(id))
    returnResponse(JSONResponse, access, refresh, content, status_code)
