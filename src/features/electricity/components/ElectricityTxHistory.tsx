import { Box, Image, Text } from "@/components";
import { logger } from "@/lib/logger";
import {
  createStyleHook,
  formatCurrency,
  getElectricityProviderLogoFromText,
  getFirstValidValue,
} from "@/lib/utils";
import dayjs from "dayjs";
import { router } from "expo-router";
import { FC } from "react";
import { Pressable } from "react-native";
import { txDetailRef } from "../tx_detail_ref";
import { IElectricityTx } from "../types";
import { isElectricityTxSuccessful } from "../utils";

interface ElectricityTxHistoryProps {
  tx: IElectricityTx;
}

/**
 * Renders single electricity tx history item
 */
export const ElectricityTxHistory: FC<ElectricityTxHistoryProps> = ({ tx }) => {
  const { styles, palette } = useStyles();

  if (!tx?.response) {
    logger.error(
      `ElectricityTxHistory:: Invalid transaction from backend:${tx}`
    );
    return null;
  }
  if (!tx.response?.content?.transactions?.product_name) {
    console.log(tx);
  }

  const providerName = tx.response.content?.transactions?.product_name || "";
  const providerLogo = getElectricityProviderLogoFromText(providerName);
  const amount = formatCurrency(
    parseFloat(
      getFirstValidValue(
        tx.amount,
        tx.response.amount,
        tx.response.content?.transactions?.amount
      ) || "0"
    ) || 0
  );
  const txDate =
    dayjs(
      getFirstValidValue(tx.response.transaction_date, tx.updated_at)
    ).format("Do MMMM YYYY h:mm A") || "N/A";
  const txSuccessful = isElectricityTxSuccessful(tx);

  const viewTx = () => {
    txDetailRef.details = tx;
    router.push("/(protected)/electricity/tx_details");
  };

  return (
    <Pressable onPress={viewTx}>
      <Box
        variant={"surface"}
        p={"s"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        flex={1}
        cg={"xs"}
      >
        <Box cg={"xs"} flexDirection={"row"} alignItems={"center"} flex={1}>
          <Box
            alignItems={"center"}
            borderWidth={1}
            justifyContent={"center"}
            p={"xxs"}
            borderRadius={"round"}
            style={{
              borderColor: palette.gray300,
            }}
          >
            <Image source={providerLogo} style={styles.providerLogo} />
          </Box>
          <Box flex={1} rg={"xxs"}>
            <Text
              fontFamily={"PrimaryBold"}
              numberOfLines={1}
              lineBreakStrategyIOS="standard"
              lineBreakMode="tail"
              ellipsizeMode="tail"
            >
              {providerName || "Failed Transaction"}
            </Text>
            <Text variant={"small"} color={"textMuted"}>
              {txDate}
            </Text>
          </Box>
        </Box>

        <Box rg={"xxs"}>
          <Text fontFamily={"PrimaryBlack"}>-{amount}</Text>
          <Box
            borderRadius={"xs"}
            alignItems={"center"}
            justifyContent={"center"}
            style={{
              backgroundColor: txSuccessful ? palette.green200 : palette.red100,
            }}
          >
            <Text
              variant={"small"}
              textAlign={"center"}
              fontFamily={"PrimaryBold"}
              style={{ fontSize: 10 }}
            >
              {txSuccessful ? "Successful" : "Failed"}
            </Text>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
};

const useStyles = createStyleHook(({ borderRadii }) => ({
  providerLogo: {
    width: "40@s",
    height: "40@s",
    aspectRatio: 1 / 1,
  },
}));
