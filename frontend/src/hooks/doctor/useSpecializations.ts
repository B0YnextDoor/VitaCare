import { useQuery } from "@tanstack/react-query";
import { specService } from "../../services/spec.service";

export const useSpecializations = () => {
  const { data } = useQuery({
    queryKey: ["specializations"],
    queryFn: () => specService.getAll(),
  });

  return { specs: data };
};
