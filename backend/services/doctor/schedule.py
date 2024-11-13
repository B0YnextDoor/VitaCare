from contextlib import AbstractContextManager
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import Callable
from datetime import time, date, timedelta
from schemas.shedule import AppointmentTime, ScheduleDB, SkipPatern


class ScheduleService():
    def __init__(self, session: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session = session
        self.exception = "exception occured - shedule not"

    def getSkipPatterns(self):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT "id", "pattern" FROM "skip_days_patterns"''')
                result = db.execute(sql)
                return [SkipPatern(*rec).to_dict() for rec in result]
        except Exception:
            return None

    def getById(self, id: int):
        try:
            with self.session() as db:
                sql = text('''SELECT ds.id, ds.start_time, ds.end_time, sdp.id AS skip_days_pattern
                           FROM "doctors_schedules" ds
                           JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
                           WHERE ds.id=:id''')
                result = db.execute(sql, {'id': id}).first()
                return ScheduleDB(*result).to_dict() if result is not None else 'schedule not found'
        except Exception:
            return None

    def getDoctorSchedules(self, user_id: int, type: int | None = None):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT "doctor_id" FROM DoctorsView WHERE "user_id"=:user_id''')
                doctor_id = db.execute(sql, {'user_id': user_id}).scalar()
                if doctor_id is None:
                    return 'doctor not found'
                sql = text('''SELECT ds.id, ds.start_time, ds.end_time, sdp.pattern AS skip_days_pattern
                           FROM "doctors_schedules" ds
                           JOIN "skip_days_patterns" sdp ON ds.skip_days_pattern_id = sdp.id
                           WHERE ds.doctor_id=:doctor_id''')
                result = db.execute(sql, {'doctor_id': doctor_id})
                schedules = [ScheduleDB(*rec).to_dict() for rec in result]
                if type is not None:
                    return schedules
                print()
                print(schedules)
                is_vacation = list(
                    filter(lambda x: x['pattern'] == 'all', schedules))
                print(is_vacation)
                print()
                return schedules if len(is_vacation) == 0 else is_vacation
        except Exception as e:
            print(e)
            return 'fetching schedules error'

    def getWeekDay(self, type: str, cur_day: date):
        day = date.weekday(cur_day)
        if type == "ends":
            delta = 1
            if day + 1 > 4:
                delta = 7 - day
            return cur_day + timedelta(days=delta)
        days = [1, 3, 5] if type == "odd" else [0, 2, 4]
        days_diff = [(d - day) % 7 for d in days if d != day]
        delta = min(days_diff)
        return cur_day + timedelta(days=delta)

    def checkAppTime(self, hours: int, mins: int, apps: list[tuple[int, int]]):
        for h, m in apps:
            if (hours == h and mins == m):
                return False
        return True

    def formatFreeTime(self, start_h: int, start_m: int, end_h: int, end_m: int, apps=None):
        result = list()
        begin = 0 if start_m == 0 else 1
        while (start_h != end_h or start_m != end_m):
            if (apps is None or self.checkAppTime(start_h, start_m, apps) == True):
                result.append(str(time(hour=start_h, minute=start_m)))
            start_m = 0 if start_m == 30 else 30
            begin += 1
            if begin > 1:
                begin = 0
                start_h += 1
        return result

    def getAvailableTime(self, user_id: int):
        try:
            doc_schedules = self.getDoctorSchedules(user_id)
            if type(doc_schedules) is str:
                return doc_schedules
            isVacation = False
            schedules = dict()
            for sch in doc_schedules:
                pattern = sch['pattern']
                if pattern == 'all':
                    isVacation = True
                    break
                start = list(
                    map(lambda x: int(x), sch['start_time'].split(":")))
                end = list(map(lambda x: int(x), sch['end_time'].split(":")))
                schedules[pattern] = (*(start), *(end))
            if isVacation == True:
                return {"schedule": [], 'day': ""}
            cur_date = date.today()
            nearest_dates = dict()
            for key in schedules:
                possible_date = self.getWeekDay(key, cur_date)
                if key not in nearest_dates or possible_date < nearest_dates[key]:
                    nearest_dates[key] = str(possible_date)
            hasFreeDay = False
            available_schedule = list()
            day = ""
            with self.session() as db:
                while (True):
                    for key, val in nearest_dates.items():
                        sql = text(
                            f'''SELECT appointment_date FROM select_and_check_appointments(2, {user_id}) WHERE DATE(appointment_date)=:date AND status_id NOT IN (2, 3)''')
                        result = db.execute(sql, {"date": val})
                        apps = [AppointmentTime(*rec).to_tuple()
                                for rec in result]
                        if (len(apps) == 0):
                            available_schedule = self.formatFreeTime(
                                *schedules[key])
                            hasFreeDay = True
                            day = val
                            break
                        available_schedule = self.formatFreeTime(
                            *(*schedules[key], apps))
                        if (len(available_schedule) > 0):
                            hasFreeDay = True
                            day = val
                            break
                    if (hasFreeDay == True):
                        break
                    for key, value in nearest_dates.items():
                        nearest_dates[key] = str(self.getWeekDay(
                            key, date(*list(map(lambda x: int(x), value.split('-'))))))
                return {"schedule": available_schedule, 'day': day}
        except Exception as e:
            print(e)
            return 'fetching free time error'

    def createSchedule(self, start_time: time, end_time: time, pattern_id: int, user_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''SELECT "doctor_id" FROM DoctorsView WHERE "user_id"=:user_id''')
                doctor_id = db.execute(sql, {'user_id': user_id}).scalar()
                if doctor_id is None:
                    return 'doctor not found'
                sql = text('''INSERT INTO "doctors_schedules" ("start_time", "end_time", "skip_days_pattern_id", "doctor_id") VALUES (:start_time, :end_time, :pattern_id, :doctor_id) RETURNING *''')
                result = db.execute(sql, {'start_time': start_time, 'end_time': end_time,
                                    'pattern_id': pattern_id, 'doctor_id': doctor_id}).first()
                db.commit()
                return ScheduleDB(*result).to_dict() if result is not None else 'create schedule error'
        except Exception:
            return f'{self.exception} created'

    def updateSchedule(self, start_time: time, end_time: time, pattern_id: int, schedule_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''UPDATE "doctors_schedules" SET "start_time"=:start_time, "end_time"=:end_time,"skip_days_pattern_id"=:pattern_id WHERE "id"=:schedule_id RETURNING *''')
                result = db.execute(sql, {'start_time': start_time, 'end_time': end_time,
                                          'pattern_id': pattern_id, 'schedule_id': schedule_id}).first()
                db.commit()
                return ScheduleDB(*result).to_dict() if result is not None else 'update schedule error'
        except Exception:
            return f'{self.exception} updated'

    def deleteSchedule(self, schedule_id: int):
        try:
            with self.session() as db:
                sql = text(
                    '''DELETE FROM "doctors_schedules" WHERE "id"=:schedule_id RETURNING *''')
                result = db.execute(sql, {'schedule_id': schedule_id}).first()
                db.commit()
                return ScheduleDB(*result).to_dict() if result is not None else 'delete schedule error'
        except Exception:
            return f'{self.exception} deleted'
