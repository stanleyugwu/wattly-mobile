import { apiClient } from "@/lib/api";
import { ReferralsRes } from "./types";

export const getReferrals = async () => {
  const res = await apiClient.get<ReferralsRes>("/referralsUser");
  return res.data;
};
