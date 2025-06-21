import { useQuery } from "react-query";
import { getElectricityTxs } from "../api";

export const useGetElectricityTxs = () =>
  useQuery({
    queryFn: getElectricityTxs,
    queryKey: ["get_electricity_txs"],
  });
