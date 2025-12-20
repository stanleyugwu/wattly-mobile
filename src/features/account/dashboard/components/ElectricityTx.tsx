import { FC } from "react";

import { Box, Image, Text } from "@/components";
import { txDetailRef } from "@/features/electricity/tx_detail_ref";
import { IElectricityTx } from "@/features/electricity/types";
import {
  createStyleHook,
  getElectricityProviderLogoFromServiceId,
  getFirstValidValue,
} from "@/lib/utils";
import { router } from "expo-router";
import { Pressable } from "react-native";

interface ElectricityTxProps {
  tx: IElectricityTx;
}

/**
 * Renders electicity transaction card
 */
export const ElectricityTx: FC<ElectricityTxProps> = ({ tx }) => {
  const { styles } = useTheme();

  // E.g product name: "Ikeja Electric Payment - IKEDC"
  const providerName =
    tx?.response?.content?.transactions?.product_name || "Electricity";

  const meterNo = getFirstValidValue(
    tx?.response?.meterNumber,
    tx?.response?.content?.transactions?.phone,
    tx?.response?.token
  );

  const providerLogo = getElectricityProviderLogoFromServiceId(tx?.service_id);

  const viewTx = () => {
    txDetailRef.details = tx;
    router.push("/(protected)/electricity/tx_details");
  };

  return (
    <Pressable onPress={viewTx}>
      <Box bg={"background"} p="s" borderRadius={"s"}>
        <Box cg={"s"} flexDirection={"row"}>
          <Box p={"xs"} bg={"white"} borderRadius={"round"}>
            <Image source={providerLogo} style={styles.providerLogo} />
          </Box>
          <Box>
            <Text fontFamily={"PrimaryBold"} variant={"small"}>
              {providerName}
            </Text>
            <Text variant={"small"}>({meterNo || "N/A"})</Text>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
};

const useTheme = createStyleHook(({ colors }) => ({
  providerLogo: {
    width: "30@s",
    height: "30@s",
    borderRadius: "20@s",
    borderWidth: 1,
    borderColor: colors.border,
  },
}));
