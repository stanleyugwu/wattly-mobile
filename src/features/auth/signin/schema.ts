import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, "Password Must be at least 2 characters"),
});
