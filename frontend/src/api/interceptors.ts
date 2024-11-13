import axios, { type CreateAxiosDefaults } from "axios";
import { PAGES } from "../config/urls";
import { toast } from "sonner";

const options: CreateAxiosDefaults = {
  baseURL: "http://localhost:1337",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const authApi = axios.create(options);

export const userApi = axios.create(options);

userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status == 401) {
      if (window.location.pathname != "/") window.location.replace(PAGES.AUTH);
      return error;
    }
    throw error;
  }
);
