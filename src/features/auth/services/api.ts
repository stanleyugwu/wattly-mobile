import { AxiosResponse } from "axios";

import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";
import {
  VerifySignupEmailFnParam,
  VerifySignupEmailReqPayload,
  VerifySignupEmailResponse,
} from "../signup/otp_verification/types";

import { SignInFormData, SignInResponse } from "../signin/types";

import {
  SignUpFormData,
  SignUpReqPayload,
  SignUpResponse,
} from "../signup/types";

export const signIn = async ({
  email,
  password,
}: SignInFormData): Promise<SignInResponse> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<SignInResponse>,
    SignInFormData
  >("/sign_in", {
    email,
    password,
  });

  return res.data;
};

export const signUp = async ({
  email,
  password,
  confirmPassword,
  fullName,
  phone,
  referralCode,
}: SignUpFormData): Promise<SignUpResponse> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<SignUpResponse>,
    SignUpReqPayload
  >("/sign_up", {
    email,
    password,
    fullname: fullName,
    password_confirmation: confirmPassword,
    refferel: referralCode || "",
    phone: phone,
  });

  return res.data;
};

export const verifySignupEmail = async ({
  email,
  otp,
}: VerifySignupEmailFnParam): Promise<VerifySignupEmailResponse> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<VerifySignupEmailResponse>,
    VerifySignupEmailReqPayload
  >(`/verify-email/${email}`, { otp });
  return res.data;
};

export const resendSignupOtp = async (email: string) => {
  const res = await apiClient.post<APIResponse<null>>(
    `/new-email-otp/${email}`
  );
  return res.data;
};
