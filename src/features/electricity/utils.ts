import { User } from "@/types";
import { IElectricityTx } from "./types";

export const balanceSufficient = (user: User | null, amount?: string) => {
  const balance = parseFloat(user?.profile?.balance || "0");
  const topUpAmt = parseFloat(amount || "0");
  if (!balance || !topUpAmt || balance < topUpAmt) return false;
  return true;
};

export const isTxSuccessful = (tx: IElectricityTx): boolean => {
  return (
    tx.response?.code === "000" &&
    tx.response?.content?.transactions?.status === "delivered"
  );
};

export const isTxPending = (tx: IElectricityTx): boolean => {
  const code = tx.response?.code;
  const status = tx.response?.content?.transactions?.status;
  return (
    code === "099" ||
    code === "044" ||
    (code === "000" && (status === "pending" || status === "initiated"))
  );
};

/**
 * Service provider error
 */
export const isServiceError = (tx: IElectricityTx): boolean => {
  const code = tx.response?.code;
  const failedCodes = ["030", "034", "035", "083"];
  return failedCodes.includes(code);
};

/**
 * Our own server error or misconfig with service provider
 */
export const isSeverError = (tx: IElectricityTx): boolean => {
  const code = tx.response?.code;
  const pendingCodes = [
    "014",
    "018",
    "021",
    "022",
    "023",
    "024",
    "027",
    "028",
    "085",
  ];
  return pendingCodes.includes(code);
};

/**
 * Parameter validation error, which we want to log
 */
export const isValidationError = (tx: IElectricityTx): boolean => {
  const code = tx.response?.code;
  const errorCodes = ["010", "011", "012", "013", "017"];

  return errorCodes.includes(code);
};
