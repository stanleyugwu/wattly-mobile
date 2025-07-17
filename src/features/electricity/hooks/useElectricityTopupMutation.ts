import { useMutation } from "react-query";

import { QueryKeys } from "@/lib/api";
import { topUpElectricity } from "../api";

export const useElectricityTopupMutation = () =>
  useMutation({
    mutationFn: topUpElectricity,
    mutationKey: QueryKeys.electricityTopUp,
  });
