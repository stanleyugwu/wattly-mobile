import { APIResponse } from "@/types";

export interface VerifySignupEmailFnParam {
  email: string;
  otp: string;
}

export interface VerifySignupEmailReqPayload {
  otp: string;
}

export type VerifySignupEmailResponse = APIResponse<null>;
