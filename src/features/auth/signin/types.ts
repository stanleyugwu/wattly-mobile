import { z } from "zod";

import { signInSchema } from "./schema";
import { APIResponse, User } from "@/types";

export type SignInFormData = z.infer<typeof signInSchema>;

export type SignInResponse = APIResponse<{
  user: User["profile"];
  token: string;
}>;
