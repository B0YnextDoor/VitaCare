from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from dependency_injector.wiring import inject, Provide
from core.container import Container
from middleware.user import returnResponse, deleteCookie
from schemas.auth import UserAuth, PatientSignUp
from services.auth.auth import AuthService


authRouter = APIRouter(prefix="/auth", tags=["auth"])


@authRouter.post("/sign-in")
@inject
async def sign_in(data: UserAuth, service: AuthService = Depends(Provide[Container.auth_service])):
    access_token, refresh_token = service.signIn(data)
    if access_token is None:
        return JSONResponse(status_code=401, content={"error": refresh_token})
    return returnResponse(JSONResponse, access_token, refresh_token)


@authRouter.post("/sign-up")
@inject
async def sign_up(data: PatientSignUp, service: AuthService = Depends(Provide[Container.auth_service])):
    access_token, refresh_token = service.signUp(data)
    if access_token is None:
        return JSONResponse(status_code=401, content={"error": refresh_token})
    return returnResponse(JSONResponse, access_token, refresh_token)


@authRouter.post("/sign-out")
@inject
async def log_out():
    return deleteCookie(JSONResponse(content="log-out"))
