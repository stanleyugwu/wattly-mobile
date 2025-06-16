import { z } from "zod";

import { APIResponse } from "@/types";
import { signUpSchema } from "./schema";

export type SignUpFormData = z.infer<typeof signUpSchema>;

export interface SignUpReqPayload {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  refferel?: string;
}

export type SignUpResponse = APIResponse<{
  account_number: number;
  refferel_link: string;
  token: string;
}>;
