from datetime import datetime


class LogAction():
    def __init__(self, id: int, type: str, description: str, log_date: datetime, user_id: int, user_email: str, user_name: str, user_surname: str):
        self.id = id
        self.type = type
        self.description = description
        self.log_date = str(log_date)
        self.user_id = user_id
        self.user_email = user_email
        self.user_name = user_name
        self.user_surname = user_surname

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "description": self.description,
            "log_date": self.log_date,
            "user_id": self.user_id,
            "user_email": self.user_email,
            "user_name": self.user_name,
            "user_surname": self.user_surname
        }
