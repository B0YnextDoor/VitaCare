import { userApi } from "../api/interceptors";
import { ROLES } from "../config/config";
import {
  IAvailableDate,
  ISchedule,
  IScheduleForm,
  ISkipPattern,
} from "../types/schedule";

export const scheduleService = {
  SCHEDULE_URL: "/schedule/",

  async getSkipPatterns() {
    const response = await userApi.get<ISkipPattern[]>(
      `${this.SCHEDULE_URL}patterns`
    );
    if (response.status == 200) return response.data;
  },

  async getById(id?: string) {
    if (!id) return;
    const response = await userApi.get<IScheduleForm>(
      `${this.SCHEDULE_URL}id?id=${id}`
    );
    if (response.status == 200) return response.data;
  },

  async getDoctorSchedule(id?: string, type?: boolean) {
    if (!id) return;
    const response = await userApi.get<ISchedule[]>(
      `${this.SCHEDULE_URL}?doc_id=${id}${type ? `&all=${ROLES.ADMIN}` : ""}`
    );
    if (response.status == 200) return response.data;
  },

  async getAvailableTime(id?: string) {
    if (!id) return;
    const response = await userApi.get<IAvailableDate>(
      `${this.SCHEDULE_URL}doc?doc_id=${id}`
    );
    if (response.status == 200) return response.data;
  },

  async create(data: ISchedule) {
    if (!data.doctor_id) return;
    const response = await userApi.post(this.SCHEDULE_URL, data);
    return response;
  },

  async update(data: ISchedule) {
    if (!data.id) return;
    const { id, ...rest } = data;
    const response = await userApi.put(`${this.SCHEDULE_URL}?id=${id}`, rest);
    return response;
  },
};
