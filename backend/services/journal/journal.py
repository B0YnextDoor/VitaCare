from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from schemas.journal import LogAction


class LogActionService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]):
        self.session = session

    def getAll(self):
        try:
            with self.session() as db:
                sql = text('''SELECT la.id, lat.name AS type_name, la.description, la.log_date, u.id as user_id, 
                           u.email, ui.name, ui.surname
                           FROM "log_actions" AS la
                           JOIN "log_action_types" AS lat ON la.type_id = lat.id
                           JOIN "users" AS u ON la.user_id = u.id
                           JOIN "user_infos" AS ui ON u.id = ui.user_id
                           ORDER BY la.log_date DESC''')
                result = db.execute(sql)
                return [LogAction(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getByActionTypeId(self, id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT la.id, lat.name AS type_name, la.description, la.log_date, u.id as user_id, 
                           u.email, ui.name, ui.surname
                           FROM "log_actions" AS la 
                           JOIN "log_action_types" AS lat ON la.type_id = lat.id
                           JOIN "users" AS u ON la.user_id = u.id
                           JOIN "user_infos" AS ui ON u.id = ui.user_id
                           WHERE lat.type_id=:id''')
                result = db.execute(sql, {"id": id})
                return [LogAction(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getByUserId(self, id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT la.id, lat.name AS type_name, la.description, la.log_date, u.id as user_id, 
                           u.email, ui.name, ui.surname 
                           FROM "log_actions" AS la 
                           JOIN "log_action_types" AS lat ON la.type_id = lat.id
                           JOIN "users" AS u ON la.user_id = u.id
                           JOIN "user_infos" AS ui ON u.id = ui.user_id
                           WHERE la.user_id=:id''')
                result = db.execute(sql, {"id": id})
                return [LogAction(*rec).to_dict() for rec in result]
        except Exception:
            return None
