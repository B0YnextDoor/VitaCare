import { useQuery } from "@tanstack/react-query";
import { qualService } from "../../services/qual.service";

export const useQualifications = () => {
  const { data } = useQuery({
    queryKey: ["qualifications"],
    queryFn: () => qualService.getAll(),
  });

  return { quals: data };
};
