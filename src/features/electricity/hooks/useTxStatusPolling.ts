import { logger } from "@/lib/logger";
import { useEffect, useRef } from "react";
import { getTxStatus } from "../api";
import { IElectricityTx } from "../types";
import { isTxPending } from "../utils";

// the initial tx passed to this hook might have customer name and address
// we want to preseve that across requeries
let customerName: string = "";
let customerAdddress: string = "";

export const useTxStatusPolling = (
  tx: IElectricityTx,
  setTx: React.Dispatch<React.SetStateAction<IElectricityTx | null>>
) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let delay = 3000; // start at 3s

    const poll = async () => {
      try {
        const newTx = await getTxStatus(tx.request_id);

        if (!isTxPending(newTx)) {
          setTx((prev) => ({
            ...prev,
            ...newTx,
            response: {
              ...prev?.response,
              ...newTx.response,
              customerAddress:
                customerAdddress || prev?.response.customerAddress || "N/A",
              customerName:
                customerName || prev?.response?.customerName || "N/A",
              content: {
                ...prev?.response?.content,
                ...newTx.response?.content,
              },
            },
          }));
        } else {
          // schedule next check with exponential backoff
          timeoutRef.current = setTimeout(() => {
            delay = Math.min(delay * 2, 60000); // cap at 60s
            poll();
          }, delay);
        }
      } catch (error) {
        logger.error(
          "ElectricityTxDetailsScreen::Failed to requery tx status",
          {
            error,
          }
        );
      }
    };

    if (isTxPending(tx)) {
      const addr = tx.response?.customerAddress;
      const name = tx.response?.customerName;
      if (addr) customerAdddress = addr;
      if (name) customerName = name;
      poll();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tx?.request_id]);
};
