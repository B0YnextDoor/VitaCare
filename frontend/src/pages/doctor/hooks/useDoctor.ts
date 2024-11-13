import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doctorService } from "../../../services/doctor.service";
import { useEffect, useState } from "react";
import { IDoctorProfile } from "../../../types/user";

export const useDoctor = (id?: string) => {
  const client = useQueryClient();
  const {
    data: doctor,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [`doctor_${id}`],
    queryFn: () => doctorService.getById(id),
    retry: 1,
  });

  const [data, setData] = useState<IDoctorProfile | undefined>(doctor);

  useEffect(() => {
    if (doctor && isSuccess) setData(doctor);
    else client.invalidateQueries({ queryKey: [`doctor_${id}`] });
  }, [doctor, isSuccess, id]);

  return { data, isLoading, isSuccess };
};
