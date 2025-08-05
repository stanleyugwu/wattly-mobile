import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import { AxiosResponse } from "axios";
import { PaymentRef, WalletFundingVerificationRes } from "./types";

export const getPaymentRef = async (amount: string): Promise<PaymentRef> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<PaymentRef>,
    { amount: string }
  >("/add-money", {
    amount,
  });

  return res.data;
};

export const verifyWalletFunding = async (reference: string) => {
  const res = await apiClient.get<APIResponse<WalletFundingVerificationRes>>(
    `/paystack/callback?reference=${reference}`
  );
  return res.data.data;
};
