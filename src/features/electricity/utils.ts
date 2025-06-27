import { IElectricityTx } from "./types";

export const isElectricityTxSuccessful = (tx: IElectricityTx): boolean => {
  return Boolean(
    tx?.response.content?.transactions?.status === "delivered" ||
      tx?.status === "success" ||
      tx?.response?.token
  );
};
