import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import { IElectricityTx } from "./types";

export const getElectricityTxs = async (): Promise<IElectricityTx[]> => {
  const { data: res } = await apiClient.get<APIResponse<IElectricityTx[]>>(
    "/electricities"
  );
  return res.data;
};
