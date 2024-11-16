import { useQuery } from "@tanstack/react-query";
import { doctorService } from "../../services/doctor.service";

export const useDoctors = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => doctorService.getAll(),
    retry: 1,
  });

  return { data, isLoading };
};
