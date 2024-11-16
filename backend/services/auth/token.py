from jose import jwt
from datetime import datetime, timedelta
from schemas.auth import TokenData
from core.config import config


class TokenService():
    def __init__(self):
        self.error = "token service error"
        self.unauth = "unauthorized"

    def generate(self, data: TokenData):
        try:
            access_token = jwt.encode(claims={'user': data.id,
                                              'role': data.role,
                                              'exp': datetime.now() + timedelta(minutes=int(config.ACCESS_EXPIRES_IN))},
                                      key=config.ACCESS_SECRET)
            refresh_token = jwt.encode(claims={'user': data.id,
                                               'role': data.role,
                                               'exp': datetime.now() +
                                               timedelta(minutes=int(config.REFRESH_EXPIRES_IN))},
                                       key=config.REFRESH_SECRET)
            return access_token, refresh_token
        except Exception as e:
            print(e)
            return None, self.error

    def decode(self, token: str | None, type: bool = False):
        if token is None:
            return None
        try:
            return jwt.decode(token, key=config.REFRESH_SECRET if type == True else config.ACCESS_SECRET)
        except Exception:
            return None

    def refresh(self, token: str | None):
        if token is None:
            return None, self.unauth, None
        try:
            userData = self.decode(token, True)
            if userData is None:
                return None, self.unauth, None
            access, refresh = self.generate(userData)
            if access is None:
                return None, refresh, None
            return userData, access, refresh
        except Exception:
            return None, self.error, None
