import { apiClient } from "@/lib/api";
import { APIResponse, User } from "@/types";
import { AxiosResponse } from "axios";

export const getProfile = async (): Promise<User["profile"]> => {
  const res = await apiClient.get<APIResponse<User["profile"]>>("/profile");
  return res.data.data;
};

export const createTransactionPin = async (pin: string) => {
  const res = await apiClient.post<
    any,
    AxiosResponse<APIResponse<null>>,
    { transaction_pin: string; transaction_pin_confirmation: string }
  >("/set-pin", { transaction_pin: pin, transaction_pin_confirmation: pin });
  return res.data.data;
};
