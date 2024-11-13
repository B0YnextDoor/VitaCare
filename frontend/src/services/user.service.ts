import { userApi } from "../api/interceptors";
import type { Profile, TProfileForm } from "../types/user";

export const userService = {
  USER_URL: "/user/",

  async getProfile(): Promise<Profile | undefined> {
    const response = await userApi.get<Profile>(`${this.USER_URL}profile`);
    if (response.status == 200) return response.data;
  },

  async updateProfile(data: TProfileForm) {
    const response = await userApi.put(`${this.USER_URL}update-profile`, data);
    return response;
  },
};
