import { userApi } from "../api/interceptors";
import { ILog } from "../types/logs";

export const logService = {
  LOG_URL: "/logs/",

  async getAll() {
    const response = await userApi.get<ILog[]>(this.LOG_URL);
    if (response.status == 200) return response.data;
  },
};
