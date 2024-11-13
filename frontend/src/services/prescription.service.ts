import { userApi } from "../api/interceptors";
import { IPrescription, IPrescriptionForm } from "../types/med";

export const prescriptionService = {
  BASE_URL: "/prescription/",

  async getByRecord(id?: string) {
    if (!id) return;
    const response = await userApi.get<IPrescription[]>(
      `${this.BASE_URL}id?id=${id}`
    );
    if (response.status == 200) return response.data;
  },

  async create(data: IPrescriptionForm) {
    const response = await userApi.post(this.BASE_URL, data);
    return response;
  },
};
