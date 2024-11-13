import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/user.service";
import { useMemo } from "react";

export const useProfile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  });

  const isClient = useMemo(() => !!(data && data.role == 3), [data?.role]);

  return { data, isLoading, isClient, role: data?.role };
};
