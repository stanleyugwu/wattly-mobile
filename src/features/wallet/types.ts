export interface IWalletTx {
  id: number;
  sender_id: string;
  recipient_id: string;
  amount: string;
  type: "transfer";
  transaction_fee: string;
  reference: string;
  description: string;
  network: string;
  created_at: string;
  updated_at: string;
}
