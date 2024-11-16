const appStatuses = [
  "Active",
  "Passed",
  "Cancelled by client",
  "Cancelled by clinic",
];

const appColors = ["yellow", "green", "blue", "red"];
const billColors = ["red", "orange", "green"];

type TStatus = "app" | "bill";

export const statusToText = (status: number) => {
  return appStatuses[status - 1];
};

export const statusToColor = (status: number, type: TStatus) => {
  return type == "app" ? appColors[status - 1] : billColors[status - 1];
};
