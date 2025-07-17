import { z } from "zod";
import { AMOUNT_REGEX } from "../electricity";

export const ACCT_NUMBER_REGEX = /^[0-9]{10}$/;

export const transferSchema = z.object({
  accountNumber: z.string().refine((val) => ACCT_NUMBER_REGEX.test(val), {
    message: "Account number must be 10 digits",
  }),
  amount: z
    .string()
    .trim()
    .regex(AMOUNT_REGEX, {
      message: "Enter a valid amount",
    })
    .refine((val) => (parseFloat(val) || 0) > 0, {
      message: "Amount must be greater than zero",
    }),
  description: z.string().max(100, "Description is too long").optional(),
});
