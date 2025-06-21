import { FC } from "react";

import { Box, Image, Text } from "@/components";
import {
  IElectricityTx,
  ElectricityProviders as Provider,
} from "@/features/electricity/types";
import { createStyleHook } from "@/lib/utils";
import { Images, RemoteImages } from "@assets/index";

let getValidValue = (...args: string[]) => {
  for (let a of args) if (a && a != "N/A") return a;
};

const providerToLogo = {
  [Provider.EEDC]: RemoteImages.eedcLogo,
  [Provider.AEDC]: RemoteImages.aedcLogo,
  [Provider.EKEDC]: RemoteImages.ekedc,
  [Provider.IBEDC]: RemoteImages.ibedc,
  [Provider.IKEDC]: RemoteImages.ikedc,
};

interface ElectricityTxProps {
  tx: IElectricityTx;
}

/**
 * Renders electicity transaction card
 */
export const ElectricityTx: FC<ElectricityTxProps> = ({ tx }) => {
  const { styles } = useTheme();

  // TODO: find more efficient way to determine provider and map to logo
  const providerName = tx?.response?.content?.transactions?.product_name || "";
  // E.g product name: "Ikeja Electric Payment - IKEDC"

  const meterNo = getValidValue(
    tx?.response?.meterNumber,
    tx?.response?.content?.transactions?.phone,
    tx?.response?.token
  );

  const providerAbbrv = providerName.split("-")[1]?.trim() as Provider;
  // E.g providerAbbrv: "IKEDC"

  const providerLogo = providerToLogo[providerAbbrv] ?? Images.iconSmall;

  return (
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
