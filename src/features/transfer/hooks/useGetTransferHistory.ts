import { useQuery } from "react-query";

import { QueryKeys } from "@/lib/api";
import dayjs from "dayjs";
import { getTransferHistory } from "../api";

export const useGetTransferHistory = () =>
  useQuery({
    queryFn: getTransferHistory,
    queryKey: QueryKeys.getTransferTxs,
    select(data) {
      return data.sort((tx1, tx2) => {
        const tx1Date = dayjs(tx1.updated_at || new Date()).valueOf();
        const tx2Date = dayjs(tx2.updated_at || new Date()).valueOf();
        return tx2Date - tx1Date;
      });
    },
  });
