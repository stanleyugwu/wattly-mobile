import { useQuery } from "react-query";
import { getWalletTxs } from "../api";

export const useGetWalletTxs = () =>
  useQuery({
    queryFn: getWalletTxs,
    queryKey: ["get_wallet_txs"],
  });
