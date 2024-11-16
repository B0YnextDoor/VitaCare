import { Loader } from "../ui/Loader";
import { AppointmentCard } from "./AppointmentCard";
import "./AppointmentList.css";
import { useAppointments } from "./hooks/useAppointments";

export const AppointmentsList = ({ role }: { role?: number }) => {
  const { data, isLoading } = useAppointments();

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <Loader size={20} color="black" />
      ) : (
        <div className="flex flex-col">
          {data ? (
            data.map((app, id) => (
              <AppointmentCard key={id} role={role} app={app} />
            ))
          ) : (
            <h3 className="text-2xl font-bold text-gray-800">
              No appointments yet...
            </h3>
          )}
        </div>
      )}
    </div>
  );
};
