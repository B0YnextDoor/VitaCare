import { useParams } from "react-router-dom";
import { RecordInfo } from "./RecordInfo";
import { RecordForm } from "./RecordForm";

export const Record = () => {
  const { id } = useParams();

  return id ? <RecordInfo id={id} /> : <RecordForm />;
};
