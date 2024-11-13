import { userApi } from "../api/interceptors";
import { ISpecializationDb } from "../types/doctor";

export const specService = {
  BASE_URL: "/specialization/",

  async getAll() {
    const response = await userApi.get<ISpecializationDb[]>(this.BASE_URL);
    if (response.status == 200) return response.data;
  },
};
