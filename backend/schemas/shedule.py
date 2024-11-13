from datetime import time, datetime
from pydantic import BaseModel


class SkipPatern():
    def __init__(self, id: int, pattern: str):
        self.id = id
        self.pattern = pattern

    def to_dict(self):
        return {
            "id": self.id,
            "pattern": self.pattern
        }


class Schedule(BaseModel):
    start_time: time
    end_time: time
    pattern: int | str
    doctor_id: int | None


class ScheduleDB():
    def __init__(self, id: int, start_time: time, end_time: time, pattern: int | str, doctor_id: int | None = None):
        self.id = id
        self.start_time = str(start_time)[:-3]
        self.end_time = str(end_time)[:-3]
        self.pattern = pattern
        self.doctor_id = doctor_id

    def to_dict(self):
        return {
            "id": self.id,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "pattern": self.pattern,
            "doctor_id": self.doctor_id
        }


class AppointmentTime():
    def __init__(self, date: datetime) -> None:
        app_time = str(date.time()).split(":")
        self.hours = int(app_time[0])
        self.minutes = int(app_time[1])

    def to_tuple(self):
        return (self.hours, self.minutes)
