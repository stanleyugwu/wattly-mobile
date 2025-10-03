export type PaymentProvider = "flutterwave" | "paystack";
export type PaymentRef = {
  payment_url: string;
  reference: string;
  provider: PaymentProvider;
};

export type WalletFundingVerificationRes = {
  balance: number;
  amount: number;
};
