export type PaymentRef = {
  payment_url: string;
  reference: string;
};

export type WalletFundingVerificationRes = {
  balance: number;
  amount: number;
};
