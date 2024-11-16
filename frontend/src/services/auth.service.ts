import { authApi } from "../api/interceptors";
import { ISignInForm, ISignUpForm } from "../types/auth";

export const authService = {
  AUTH_URL: "/auth/sign-",

  async auth(type: string, data: ISignUpForm | ISignInForm) {
    const response = await authApi.post(`${this.AUTH_URL}${type}`, data);
    if (response.status == 200) return response;
  },

  async logout() {
    return await authApi.post(`${this.AUTH_URL}out`);
  },
};
