import { AxiosResponse } from "axios";

import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import {
  TransferReqPayload,
  TransferTransaction,
  VerifyAccountResPayload,
} from "./types";

export const verifyAccount = async (
  accountNo: string
): Promise<VerifyAccountResPayload> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<VerifyAccountResPayload>>,
    {
      account_number: string;
    }
  >("/account-number-detail", {
    account_number: accountNo,
  });
  return res.data.data;
};

export const transfer = async ({
  account_number,
  amount,
  description,
  transaction_pin,
}: TransferReqPayload): Promise<TransferTransaction> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<TransferTransaction>>,
    TransferReqPayload
  >("/transfer", {
    account_number,
    amount,
    description: description?.trim() || undefined,
    transaction_pin,
  });
  return res.data.data;
};

export const getTransferHistory = async (): Promise<TransferTransaction[]> => {
  const res = await apiClient.get<APIResponse<TransferTransaction[]>>(
    "/transactions/single"
  );
  return res.data.data;
};
