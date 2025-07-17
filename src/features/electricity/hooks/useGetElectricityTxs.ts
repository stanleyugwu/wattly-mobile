import { QueryKeys } from "@/lib/api";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { getElectricityTxs } from "../api";

export const useGetElectricityTxs = () =>
  useQuery({
    queryFn: getElectricityTxs,
    queryKey: QueryKeys.getElectricityTxs,
    select(data) {
      return data.sort((tx1, tx2) => {
        const tx1Date = dayjs(tx1.updated_at || new Date()).valueOf();
        const tx2Date = dayjs(tx2.updated_at || new Date()).valueOf();
        return tx2Date - tx1Date;
      });
    },
  });
