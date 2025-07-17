import { useQuery } from "react-query";

import { getTransferHistory } from "../api";

export const useGetTransferHistory = () =>
  useQuery({
    queryFn: getTransferHistory,
    queryKey: ["get_transfer_txs"],
  });
