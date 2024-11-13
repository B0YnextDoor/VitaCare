import { useLocation } from "react-router-dom";

export const useCurrentLocation = () => {
  const { pathname } = useLocation();

  return pathname == "/";
};
