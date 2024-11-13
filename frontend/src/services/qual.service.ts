import { userApi } from "../api/interceptors";
import { IQualificationDb } from "../types/doctor";

export const qualService = {
  BASE_URL: "/qualification/",

  async getAll() {
    const response = await userApi.get<IQualificationDb[]>(this.BASE_URL);
    if (response.status == 200) return response.data;
  },
};
