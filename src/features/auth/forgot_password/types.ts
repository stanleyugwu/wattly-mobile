import { APIResponse } from "@/types";

export type ForgotPasswordResponse = APIResponse<{
  otp: number;
}>;

export type VerifyPasswordResetEmailFnParam = {
  otp: string;
  email: string;
};

export type VerifyPasswordResetEmailReqPayload = { otp: string };
export type VerifyPasswordResetEmailResponse = APIResponse<null>;
