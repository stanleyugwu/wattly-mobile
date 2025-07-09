import { z } from "zod";

export const PHONE_NUMBER_REGEX = /^[0-9]{11}$/;

export const signUpSchema = z
  .object({
    fullName: z.string().min(3, "Fullname too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().refine((val) => PHONE_NUMBER_REGEX.test(val), {
      message: "Enter a valid phone number",
    }),
    password: z.string().min(8, "Password Must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password Must be at least 8 characters"),
    referralCode: z.string().min(11, "Invalid referral code").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
