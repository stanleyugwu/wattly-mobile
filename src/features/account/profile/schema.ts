import { basePasswordResetSchema } from "@/features/auth";
import { PHONE_NUMBER_REGEX } from "@/features/auth/signup/schema";
import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(2, "Enter a valid full name"),
  phone: z.string().refine((val) => PHONE_NUMBER_REGEX.test(val), {
    message: "Enter a valid phone number",
  }),
});

export const changePasswordSchema = basePasswordResetSchema
  .extend({
    oldPassword: z.string().min(1, "Please enter the old password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "New and confirm passwords do not match",
    path: ["confirmPassword"],
  });

const pinErrMsg = "Pin must be 4 digits long";
("Pin must be 4 digits long");

const baseTransferPinResetSchema = z.object({
  newPin: z.string().length(4, pinErrMsg),
  confirmPin: z.string().length(4, pinErrMsg),
});

export const changeTransferPinSchema = baseTransferPinResetSchema
  .extend({
    oldPin: z.string().length(4, pinErrMsg),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "New and confirmation pins do not match",
    path: ["confirmPin"],
  });

export const transferPinResetSchema = baseTransferPinResetSchema.refine(
  (data) => data.newPin === data.confirmPin,
  {
    message: "New and confirmation pins do not match",
    path: ["confirmPin"],
  }
);
