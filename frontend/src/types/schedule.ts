export interface ISkipPattern {
  id: number;
  pattern: string | number;
}

export interface ISchedule extends ISkipPattern {
  start_time: string;
  end_time: string;
  doctor_id?: number | null;
}

export interface IAvailableDate {
  schedule: string[];
  day: string;
}

export interface IScheduleForm extends ISchedule {
  pattern: number;
}
