import { AxiosResponse } from "axios";

import { apiClient } from "@/lib/api";
import { APIResponse } from "@/types";

import { SignInFormData, SignInResponse } from "../signin/types";

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

export const resendSignupOtp = async (email: string) => {
  const res = await apiClient.post<APIResponse<null>>(
    `/new-email-otp/${email}`
  );
  return res.data;
};
