import { ISchedule, ISkipPattern } from "../types/schedule";

export const workDays = (skip: string | number) => {
  return skip === "ends"
    ? "Monday - Friday"
    : skip === "odd"
    ? "Tuesday / Thursday / Saturday"
    : skip === "even"
    ? "Monday / Wednesday / Friday"
    : "Vacation";
};

export const reformPatterns = (
  patterns?: ISkipPattern[],
  schedules?: ISchedule[]
) => {
  if (!patterns || !schedules) return;
  const docPatterns = schedules.map((sch) => sch.pattern);
  return patterns.filter((p) => !docPatterns.includes(p.pattern));
};

const schedule: { [key: string]: (x: number) => boolean } = {
  ends: (x: number) => x >= 1 && x <= 5,
  odd: (x: number) => x != 0 && !(x % 2),
  even: (x: number) => x != 0 && !!(x % 2),
};

const minutes = [0, 30];

export const checkScheduleDate = (value: string, schedules?: ISchedule[]) => {
  const appDate = new Date(value);
  const today = new Date();

  if (
    appDate <= today ||
    (appDate.getMonth() == today.getMonth() &&
      appDate.getDate() == today.getDate())
  )
    return "Appointment can't be in the past!";

  if (!minutes.includes(appDate.getMinutes()))
    return "Appointments are held every 30 minutes!";

  if (!schedules) return "Can't check doctor schedules!";

  let error = "";
  let schedule_id = 0;

  const day = appDate.getDay();
  schedules.forEach((sch, idx) => {
    if (!schedule[`${sch.pattern}`](day))
      error = "Doctor doesn't work that day! Check the schedule!";
    else {
      error = "";
      schedule_id = idx;
    }
  });

  if (error.length) return error;

  const hours = appDate.getHours();
  if (
    hours < parseInt(schedules[schedule_id].start_time) ||
    hours >= parseInt(schedules[schedule_id].end_time)
  )
    return "Doctor doesn't work in this time!";

  return true;
};
