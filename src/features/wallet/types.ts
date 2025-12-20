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

export type PaymentMetadataRes = {
  flutterwave: boolean;
  paystack: boolean;
  manual: boolean;
  phone: string;
  bankdetail: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
};
