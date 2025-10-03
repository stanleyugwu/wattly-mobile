import { apiClient } from "@/lib/api";
import { APIResponse, User } from "@/types";
import { AxiosResponse } from "axios";
import {
  ChangePasswordFormData,
  ChangePasswordReqPayload,
  ProfileUpdateParam,
  ResetPinReqPayload,
} from "./types";

export const updateProfile = async ({
  name,
  phone,
  profilePic,
}: ProfileUpdateParam) => {
  const formData = new FormData();

  // append upploaded image if any
  if (profilePic?.uri) {
    formData.append("profile", {
      uri: profilePic.uri,
      type: profilePic.mimeType || "image/jpeg",
      name: `${name}-profile-pic`,
    } as any);
  }

  formData.append("name", name);
  formData.append("phone", phone);

  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<User["profile"]>>,
    FormData
  >("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

// TODO: send reasons
export const deleteAccount = async (
  email: string
): Promise<{
  token: string;
  profile: {};
}> => {
  const res = await apiClient.delete<
    any,
    AxiosResponse<{ token: string; profile: {} }>
  >(`/deleteUser/${email}`);
  return res.data;
};

export const changePassword = async (
  payload: ChangePasswordFormData
): Promise<null> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<null>>,
    ChangePasswordReqPayload
  >("/change-password", {
    new_password: payload.password,
    new_password_confirmation: payload.confirmPassword,
    old_password: payload.oldPassword,
  });
  return res.data.data;
};

export const forgotTransferPin = async (email: string) => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<null>>,
    { email: string }
  >("/request-pin-reset-otp", { email });
  return res.data.data;
};

export const verifyTransferPinResetOtp = async ({
  email,
  otp,
}: Pick<ResetPinReqPayload, "email" | "otp">): Promise<null> => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<null>>,
    { otp: string; email: string }
  >("/verify-pin-reset-otp", { otp, email });

  return res.data.data;
};

export const resetTransferPin = async ({
  email,
  new_pin,
  new_pin_confirmation,
  otp,
}: ResetPinReqPayload) => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<null>>,
    ResetPinReqPayload
  >(`/reset-transaction-pin`, { email, new_pin, new_pin_confirmation, otp });
  return res.data.data;
};
