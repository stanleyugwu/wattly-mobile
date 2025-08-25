import { useQuery } from "react-query";
import { getReferrals } from "./api";

export const useGetReferrals = () => {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: getReferrals,
  });
};
