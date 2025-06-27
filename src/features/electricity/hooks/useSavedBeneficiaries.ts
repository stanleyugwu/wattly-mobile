import { useEffect, useState } from "react";

import { STORE_KEYS } from "@/constants";
import { storageService } from "@/services";
import { SavedBeneficiary } from "../types";

export const useSavedBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState<SavedBeneficiary[] | null>(
    null
  );

  const deleteBeneficiary = (id: SavedBeneficiary["id"]) => {
    if (beneficiaries?.length) {
      const filtered = beneficiaries.filter((item) => item.id !== id);
      setBeneficiaries(filtered);
      storageService.setItem(STORE_KEYS.BENEFICIARIES, filtered);
    }
  };

  const saveBeneficiary = (beneficiary: SavedBeneficiary) => {
    const newBeneficiaries = beneficiaries?.length
      ? [...beneficiaries, beneficiary]
      : [beneficiary];
    setBeneficiaries(newBeneficiaries);
    storageService.setItem(STORE_KEYS.BENEFICIARIES, newBeneficiaries);
  };

  useEffect(() => {
    const getBeneficiaries = async () => {
      const data = await storageService.getItem<SavedBeneficiary[]>(
        STORE_KEYS.BENEFICIARIES
      );
      setBeneficiaries(data);
    };
    getBeneficiaries();
  }, []);

  return { beneficiaries, saveBeneficiary, deleteBeneficiary };
};
