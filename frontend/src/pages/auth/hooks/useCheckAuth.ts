import Cookies from "js-cookie";
import { config } from "../../../config/config";
import { useNavigate } from "react-router-dom";
import { PAGES } from "../../../config/urls";
import { useEffect } from "react";

export const useCheckAuth = () => {
  const token = Cookies.get(config.TOKEN);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;
    navigate(PAGES.HOME);
  }, [token]);
};
