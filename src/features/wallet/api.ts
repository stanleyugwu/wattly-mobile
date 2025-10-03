import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import { AxiosResponse } from "axios";
import {
  PaymentProvider,
  PaymentRef,
  WalletFundingVerificationRes,
} from "./types";

export const getPaymentRef = async (
  amount: string,
  paymentProvider: PaymentProvider
): Promise<PaymentRef> => {
  const flutterwave = "/flutterwave/initiate";
  const paystack = "/add-money";

  const res = await apiClient.post<
    any,
    AxiosResponse<PaymentRef>,
    { amount: string }
  >(paymentProvider === "flutterwave" ? flutterwave : paystack, {
    amount,
  });

  return res.data;
};

export const verifyWalletFunding = async (
  reference: string,
  paymentProvider: PaymentProvider
) => {
  console.log(paymentProvider);
  const flutterwave = "/flutterwave/callback";
  const paystack = "/paystack/callback";
  const res = await apiClient.get<APIResponse<WalletFundingVerificationRes>>(
    paymentProvider === "flutterwave" ? flutterwave : paystack,
    {
      params: {
        reference,
      },
    }
  );
  console.log("VERIFY", res.data);
  return res.data.data;
};
