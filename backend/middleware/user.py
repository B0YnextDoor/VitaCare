from fastapi import Depends
from dependency_injector.wiring import Provide
from core.container import Container
from services.auth.token import TokenService, datetime, timedelta
from core.config import config


def verifyUser(accessToken: str | None, refreshToken: str | None,
               service: TokenService = Depends(Provide[Container.token_service])):
    userData = service.decode(accessToken)
    if userData is not None:
        return userData, None, None
    return service.refresh(refreshToken)


def checkRole(accessToken: str | None, refreshToken: str | None, callback=None, role: list[int] | None = [1]):
    userData, access, refresh = verifyUser(accessToken, refreshToken)
    if userData is None:
        return 401, {"error": access}, None, None
    if role is None:
        return None, userData, access, refresh
    user_role = userData.get('role')
    return (*((403, {"error": "forbidden"}) if user_role not in role else
              (200, callback() if callback is not None else userData)), access, refresh)


def returnResponse(Response, access, refresh, content=None, status_code=200):
    return Response(status_code=status_code, content=content) if refresh is None else \
        setCookie(Response, access, refresh, content, status_code)


def setCookie(Response, access_token, refresh_token, content=None, status_code=200):
    response = Response(status_code=status_code, content=content)
    response.set_cookie(key=config.ACCESS,
                        value=access_token,
                        expires=(datetime.now() + timedelta(minutes=int(config.ACCESS_EXPIRES_IN))).ctime())
    response.set_cookie(key=config.REFRESH, value=refresh_token,
                        httponly=True, secure=True, samesite='none',
                        expires=(
                            datetime.now() + timedelta(minutes=int(config.REFRESH_EXPIRES_IN))).ctime())
    return response


def deleteCookie(Response):
    Response.delete_cookie(key=config.ACCESS, samesite='lax')
    Response.delete_cookie(
        key=config.REFRESH, httponly=True, secure=True, samesite='none')
    return Response
