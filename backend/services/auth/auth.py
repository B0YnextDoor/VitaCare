from contextlib import AbstractContextManager
from sqlalchemy.orm import Session
from typing import Callable
from core.security import verify_password
from schemas.auth import TokenData, UserAuth, PatientSignUp
from services.auth.token import TokenService
from services.user.user import UserService


class AuthService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]],
                 userService: UserService, tokenService: TokenService) -> None:
        self.session = session
        self.error = "wrong credentials"
        self.userService = userService
        self.tokenService = tokenService

    def signIn(self, data: UserAuth):
        db_user = self.userService.getUserByEmail(data.email)
        if db_user is None or verify_password(data.password, db_user.password) == False:
            return None, self.error
        return self.tokenService.generate(
            TokenData(db_user.user_id, db_user.role_id))

    def signUp(self, data: PatientSignUp):
        new_user = self.userService.createPatient(data)
        if new_user is None:
            return None, 'sign up error'
        elif type(new_user) is str:
            return None, new_user
        return self.tokenService.generate(TokenData(new_user.id, 3))
