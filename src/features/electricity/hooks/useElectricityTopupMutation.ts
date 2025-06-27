import { useMutation } from "react-query";

import { topUpElectricity } from "../api";

export const useElectricityTopupMutation = () =>
  useMutation({
    mutationFn: topUpElectricity,
    mutationKey: ["electricity_top_up"],
  });
