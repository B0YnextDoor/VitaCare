import { userApi } from "../api/interceptors";
import { ROLES } from "../config/config";
import { IRecord, IRecordForm } from "../types/med";

export const recordService = {
  RECORD_URL: "/record/",

  async getAll(role?: number, id?: string, type?: boolean) {
    if (!role || (role == 1 && !id)) return;
    const response = await userApi.get<IRecord[]>(
      `${this.RECORD_URL}user${id ? `?id=${id}` : ""}${
        type ? `&type=${ROLES.ADMIN}` : ""
      }`
    );
    if (response.status == 200) return response.data;
  },

  async getById(id?: string) {
    if (!id) return;
    const response = await userApi.get<IRecord>(
      `${this.RECORD_URL}id?id=${id}`
    );
    if (response.status == 200) return response.data;
  },

  async create(data: IRecordForm) {
    if (!data.patient_id) return;
    const response = await userApi.post(this.RECORD_URL, data);
    return response;
  },
};
