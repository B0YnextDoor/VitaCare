import { userApi } from "../api/interceptors";
import { APP_STATUS } from "../config/config";
import {
  IAppointment,
  IAppointmentForm,
  IAppointmentId,
} from "../types/appointment";

export const appointmentService = {
  BASE_URL: "/appointment/",

  async getAll() {},

  async getByUser() {
    const response = await userApi.get<IAppointment[]>(`${this.BASE_URL}user/`);
    if (response.status == 200) return response.data;
  },

  async getById(id?: string) {
    if (!id) return;
    const response = await userApi.get<IAppointmentId>(
      `${this.BASE_URL}id?id=${id}`
    );
    if (response.status == 200) return response.data;
  },

  async create(data: IAppointmentForm) {
    if (!data.user_id) return;
    const response = await userApi.post(`${this.BASE_URL}`, {
      ...data,
      status_id: APP_STATUS.ACTIVE,
    });
    if (response.status == 200) return response.data;
  },

  async update(data: IAppointmentForm, status_id: number) {
    if (!data.id || (!data.user_id && status_id == APP_STATUS.ACTIVE)) return;
    const { id, ...rest } = data;
    const response = await userApi.put(`${this.BASE_URL}?id=${id}`, {
      ...rest,
      status_id: status_id,
    });
    if (response.status == 200) return response.data;
  },
};
