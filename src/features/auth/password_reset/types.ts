import { z } from "zod";

import { APIResponse } from "@/types";
import { passwordResetSchema } from "./schema";

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export interface PasswordResetReqPaylod {
  email: string;
  password: string;
  password_confirmation: string;
}

export type PasswordResetResponse = APIResponse<null>;
