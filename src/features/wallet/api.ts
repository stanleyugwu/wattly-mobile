import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import { IWalletTx } from "./types";

export const getWalletTxs = async (): Promise<IWalletTx[]> => {
  const { data: res } = await apiClient.get<APIResponse<IWalletTx[]>>(
    "/transaction"
  );
  return res.data;
};
