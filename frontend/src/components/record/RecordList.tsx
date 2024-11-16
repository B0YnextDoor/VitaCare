import { Loader } from "lucide-react";
import { useRecords } from "../../hooks/doctor/useRecords";
import "./RecordList.css";
import { RecordCard } from "./widgets/RecordCard";
import { useProfile } from "../../hooks/user/useProfile";

interface IProps {
  role?: number;
  user_id?: string;
  hideDoc?: boolean;
  hidePat?: boolean;
}

export const RecordList = ({ role, user_id, hideDoc, hidePat }: IProps) => {
  const { data } = useProfile();
  const { records, isLoading } = useRecords(
    role || data?.role,
    user_id,
    hideDoc
  );
  return (
    <div
      className={`w-full h-full text-black ${
        isLoading ? "flex justify-center" : ""
      }`}
    >
      {isLoading || !data ? (
        <Loader size={20} color="black" />
      ) : (
        <div className="record-list">
          {records && records.length ? (
            records.map((rec, idx) => (
              <RecordCard
                key={idx}
                rec={rec}
                user={data?.id}
                idx={idx}
                hideDoc={hideDoc}
                hidePat={hidePat}
              />
            ))
          ) : (
            <div className="text-2xl font-bold text-gray-800">
              No records yet...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
