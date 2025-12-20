import { useQuery } from "react-query";
import { getServiceCharge } from "../api";

export const GET_SERVICE_CHARGE_KEY = "serviceCharge";

export const useGetServiceCharge = () =>
  useQuery({
    queryKey: GET_SERVICE_CHARGE_KEY,
    queryFn: getServiceCharge,
    retry: Infinity, // this is core to our offering so we want to retry till it works
  });
