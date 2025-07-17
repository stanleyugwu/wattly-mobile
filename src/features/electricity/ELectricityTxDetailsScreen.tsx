import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useRef, type FC } from "react";
import { Pressable } from "react-native";
import { s } from "react-native-size-matters";
import ViewShot, { captureRef } from "react-native-view-shot";

import { Box, Button, Image, ScreenBox, Text, TextProps } from "@/components";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import {
  createStyleHook,
  formatCurrency,
  getElectricityProviderLogoFromText,
  getFirstValidValue,
} from "@/lib/utils";
import { txDetailRef } from "./tx_detail_ref";
import { isElectricityTxSuccessful } from "./utils";

interface DetailTextProps extends TextProps {
  label: string;
  value: string;
}
export const DetailText: FC<DetailTextProps> = ({ label, value, ...rest }) => {
  return (
    <Box
      flexDirection={"row"}
      cg={"s"}
      justifyContent={"space-between"}
      alignItems={"center"}
      flex={1}
    >
      <Text flexShrink={0} textAlign={"left"} color={"textMuted"}>
        {label}
      </Text>
      <Text
        flex={1}
        textAlign={"right"}
        flexShrink={1}
        textBreakStrategy="balanced"
        fontFamily={"PrimaryBold"}
        {...rest}
      >
        {value}
      </Text>
    </Box>
  );
};

interface ElectricityTxDetailsScreenProps {}

/**
 * Screen for showing shareable electricity transaction details
 */
export const ElectricityTxDetailsScreen: FC<ElectricityTxDetailsScreenProps> = (
  _
) => {
  const tx = txDetailRef.details; // set by preceeding screen
  const { palette, styles, colors } = useStyles();
  const viewShotRef = useRef(null);

  // Ensure data is available
  if (!tx?.response) {
    router.canGoBack() && router.back();
    return null;
  }

  const handleCopyToken = async () => {
    try {
      await Clipboard.setStringAsync(token, {
        inputFormat: Clipboard.StringFormat.PLAIN_TEXT,
      });
      Toast.success("Token copied");
    } catch (error) {
      logger.error("ElectricityTxDetailsScreen:: Failed to copy token");
    }
    Toast.success("Token copied");
  };

  const handleShareAsImage = async () => {
    const uri = await captureRef(viewShotRef, {
      format: "png",
      quality: 1,
      width: 500,
      height: 1000,
    });
    console.log("📸 Image saved at:", `file://${uri}`);
  };

  const handleShareAsPdf = async () => {
    const uri = await captureRef(viewShotRef, {
      format: "png",
      quality: 1,
    });
    console.log("📸 Image saved at:", `file://${uri}`);
  };

  // START: =====>>>>>>>> NORMALIZE TX FIELDS
  const providerLogo = getElectricityProviderLogoFromText(
    tx?.response?.content?.transactions?.product_name
  );
  const providerName =
    tx?.response?.content?.transactions?.product_name || "Electricity Provider";
  const amount = formatCurrency(
    parseFloat(
      getFirstValidValue(
        tx.amount,
        tx.response.amount,
        tx.response.content?.transactions?.amount
      ) || "0"
    ) || 0
  );
  const token =
    (tx.response.token || tx.response.purchased_code || "").match(/\d+/)?.[0] ??
    "";
  const meterNo =
    getFirstValidValue(tx.billers_code, tx.response.meterNumber) || "";
  const meterType = tx.variation_code;
  const customerName = tx.response.customerName;
  const customerAddress = tx.response.customerAddress;
  const units = tx.response.units;

  //TODO: which tx id should show
  const txId = getFirstValidValue(
    tx.response.content?.transactions?.transactionId,
    tx.request_id,
    tx.response.requestId
  );
  const txDate =
    dayjs(
      getFirstValidValue(tx.response.transaction_date, tx.updated_at)
    ).format("Do MMMM YYYY h:mm A") || "N/A";
  const txSuccessful = isElectricityTxSuccessful(tx);

  return (
    <ScreenBox inSafeArea={{ top: false }}>
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
        <Box rg={"l"}>
          <Box variant={"surface"} alignItems={"center"} rg={"s"}>
            <Box
              p="xxs"
              borderWidth={1}
              borderRadius="round"
              alignItems="center"
              justifyContent="center"
              style={{
                borderColor: palette.gray300,
              }}
            >
              <Image source={providerLogo} style={styles.logo} />
            </Box>
            <Text variant={"body"} fontFamily={"PrimaryBold"}>
              {providerName}
            </Text>
            <Text variant={"heading2"} fontFamily={"PrimaryBlack"}>
              {amount}
            </Text>
            <Box
              borderRadius={"round"}
              alignItems={"center"}
              justifyContent={"center"}
              p={"xxs"}
              px={"xl"}
              style={{
                backgroundColor: txSuccessful
                  ? palette.green200
                  : palette.red100,
              }}
            >
              <Text
                variant={"small"}
                textAlign={"center"}
                fontFamily={"PrimaryBold"}
              >
                {txSuccessful ? "Successful" : "Failed"}
              </Text>
            </Box>
          </Box>
          {txSuccessful ? (
            <Box variant={"surface"}>
              <Box flexDirection={"row"} cg={"xs"}>
                <Text>Token:</Text>
                <Text fontFamily={"SpaceMono"} letterSpacing={1}>
                  {token}
                </Text>
                <Pressable
                  style={styles.copyBtn}
                  hitSlop={{ left: 30, right: 20, top: 10, bottom: 10 }}
                  onPress={handleCopyToken}
                >
                  <Ionicons
                    name="copy-outline"
                    size={s(18)}
                    color={colors.primary}
                  />
                </Pressable>
              </Box>
            </Box>
          ) : null}

          <Box variant={"surface"} rg={"s"}>
            <Text fontFamily={"PrimaryBold"}>Transaction Details</Text>
            <DetailText label={"Meter Number"} value={meterNo} />
            <DetailText label={"Customer Name"} value={customerName} />
            <DetailText
              label={"Meter Type"}
              value={meterType}
              textTransform={"uppercase"}
            />
            <DetailText label={"Customer Address"} value={customerAddress} />
            <DetailText label={"Amount Paid"} value={amount} />
            <DetailText label={"Units Purchased"} value={units} />
            <DetailText label={"Transaction No."} value={txId} />
            <DetailText label={"Transaction Date"} value={txDate} />
          </Box>
        </Box>
      </ViewShot>

      <Box flexDirection={"row"} alignSelf={"center"} mt={"l"} cg={"l"}>
        <Button label="Share as PDF" onPress={handleShareAsPdf} />
        <Button label="Share as Image" onPress={handleShareAsImage} />
      </Box>
    </ScreenBox>
  );
};

ElectricityTxDetailsScreen.displayName = "ElectricityTxDetailsScreen";

const useStyles = createStyleHook(({ zIndices }) => ({
  copyBtn: {
    position: "absolute",
    right: 0,
    zIndex: zIndices.tooltip,
  },
  logo: {
    width: "40@s",
    height: "40@s",
    borderRadius: "20@s",
    aspectRatio: 1 / 1,
  },
}));
