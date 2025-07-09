import { z } from "zod";
import { PHONE_NUMBER_REGEX } from "../auth/signup/schema";

const AMOUNT_REGEX = /^(?!0+$)\d+(\.\d{1,2})?$/;

export const electricityTopupSchema = z.object({
  provider: z.object({
    name: z
      .string({ message: "Select a provider" })
      .min(1, "Provider must have a name"),
    serviceId: z.string().min(1, "Provider must have service ID"),
    logo: z.string(),
  }),
  meterNumber: z.string().min(5, "Enter a valid meter no."),
  meterType: z.enum(["prepaid", "postpaid"]),
  phone: z.string().refine((val) => PHONE_NUMBER_REGEX.test(val), {
    message: "Enter a valid phone number",
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
});
