import { AxiosResponse } from "axios";

import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import {
  TransferReqPayload,
  TransferResPayload,
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

export const createTransactionPin = async (pin: string) => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<null>>,
    { transaction_pin: string; transaction_pin_confirmation: string }
  >("/set-pin", { transaction_pin: pin, transaction_pin_confirmation: pin });
  return res.data.data;
};

export const transfer = async ({
  account_number,
  amount,
  description,
  transaction_pin,
}: TransferReqPayload): Promise<TransferResPayload> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<TransferResPayload>>,
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
    "/transaction"
  );
  return res.data.data;
};
