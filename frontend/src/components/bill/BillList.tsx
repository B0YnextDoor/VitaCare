import { Loader } from "../ui/Loader";
import { BillCard } from "./BillCard";
import "./BillList.css";
import { useBills } from "./hooks/useBills";

export const BillList = ({ role }: { role?: number }) => {
  const { bills, isLoading } = useBills(role);

  return (
    <div
      className={`w-full h-full text-black ${
        isLoading ? "flex justify-center" : ""
      }`}
    >
      {isLoading ? (
        <Loader size={50} color="black" />
      ) : (
        <div className="bill-list">
          {bills ? (
            bills.map((bill, idx) => (
              <BillCard key={idx} bill={bill} idx={idx} role={role} />
            ))
          ) : (
            <div className="text-2xl font-bold text-gray-800">
              No bills yet...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
