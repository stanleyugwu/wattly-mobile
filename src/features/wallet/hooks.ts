import { useQuery } from "react-query";
import { getPaymentMetadata } from "./api";

export const GET_PAYMENT_METADATA_QUERY_KEY = "get-payment-metadata";

export const useGetPaymentMetadata = () => {
  return useQuery({
    queryKey: GET_PAYMENT_METADATA_QUERY_KEY,
    queryFn: getPaymentMetadata,
  });
};
