import { z } from "zod";

export const passwordResetSchema = z
  .object({
    password: z.string(),
    confirmPassword: z
      .string()
      .min(8, "Password Must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
