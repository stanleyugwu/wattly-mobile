import { z } from "zod";

import { transferSchema } from "./schema";

export type TransferFormData = z.infer<typeof transferSchema>;

export type VerifyAccountResPayload = {
  name: string;
  email: string;
  account_number: string;
};

export type TransferReqPayload = {
  account_number: string;
  amount: string;
  description?: string;
  transaction_pin: string;
};

export interface TransferTransaction {
  id: number;
  sender_id: number;
  recipient_id: number;
  sender_name: string;
  recipient_name: string;
  amount: string;
  type: string;
  transaction_fee: string;
  reference: string;
  description: string | null;
  network: string;
  created_at: string;
  updated_at: string;
  sender_account_number: number;
  recipient_account_number: number;
}
