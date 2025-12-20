import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useState, type FC } from "react";
import { Alert, Linking, Pressable } from "react-native";
import { s } from "react-native-size-matters";

import { Box, Button, Image, ScreenBox, Text, TextProps } from "@/components";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import {
  createStyleHook,
  formatCurrency,
  getElectricityProviderLogoFromServiceId,
  getFirstValidValue,
  normalizeProvidername,
} from "@/lib/utils";
import { ElectricityTopupStatusChip } from "./components";
import { useTxStatusPolling } from "./hooks";
import { txDetailRef } from "./tx_detail_ref";
import { ElectricityReceiptPayload, MeterType } from "./types";
import { isTxPending, isTxSuccessful } from "./utils";

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
      <Text
        flexShrink={0}
        variant={"small"}
        textAlign={"left"}
        color={"textMuted"}
      >
        {label}
      </Text>
      <Text
        flex={1}
        textAlign={"right"}
        flexShrink={1}
        variant={"small"}
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
  const [tx, setTx] = useState(txDetailRef.details); // set by preceeding screen
  const { palette, styles, colors } = useStyles();

  // Ensure data is available
  if (!tx?.response) {
    router.canGoBack() && router.back();
    return null;
  }

  const handleCopyToken = async () => {
    try {
      await Clipboard.setStringAsync(rawToken, {
        inputFormat: Clipboard.StringFormat.PLAIN_TEXT,
      });
      Toast.success("Token copied");
    } catch (error) {
      logger.error("ElectricityTxDetailsScreen:: Failed to copy token", {
        error,
      });
    }
    Toast.success("Token copied");
  };

  /**
   * Handles transaction report by opening email to support@wattly.ng
   * with prefilled transaction reference
   */
  const handleReportTransaction = async () => {
    try {
      const subject = encodeURIComponent("Transaction Report");
      const body = encodeURIComponent(
        `Hello Wattly Support,\n\nI would like to report an issue with the following transaction:\n\nTransaction Reference: ${txId}\n\nThank you.`
      );
      const supportEmail = "support@wattly.ng";
      const mailtoUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

      await Linking.openURL(mailtoUrl);
    } catch (error: any) {
      Alert.alert("Error", "Unable to open email client. Please try again.");
    }
  };
  const handleShareReceipt = () => {
    router.navigate({
      pathname: "/(protected)/electricity/tx_receipt/[tx_id]",
      params: {
        tx_id: txId,
        txId: txId,
        amount,
        customerAddress,
        customerName,
        meterType: meterType as MeterType,
        meterNumber: meterNo,
        providerLogo,
        providerName,
        serviceId: tx.service_id,
        token,
        txDate,
        phone: tx.phone,
        service: "Electricity",
        debtAmount,
        tariff,
        taxAmount,
        debtAmountPaid,
        debtRemaining,
        txStatus: txPending
          ? "pending"
          : txSuccessful
          ? "successful"
          : txReversed
          ? "reversed"
          : "failed",
        units,
      } satisfies ElectricityReceiptPayload & { tx_id: string },
    });
  };

  // START: =====>>>>>>>> NORMALIZE TX FIELDS
  const providerLogo = getElectricityProviderLogoFromServiceId(tx.service_id);

  const providerName = normalizeProvidername(
    tx?.response?.content?.transactions?.product_name,
    tx?.service_id
  );

  const amount = formatCurrency(
    parseFloat(
      getFirstValidValue(
        tx.amount,
        tx.response.amount,
        tx.response.content?.transactions?.amount
      ) || "0"
    ) || 0
  );

  const rawToken =
    (tx.token || tx.response.token || tx.response.purchased_code) ?? "";
  const token = rawToken.match(/.{1,4}/g)?.join("-") ?? rawToken;

  const meterNo =
    getFirstValidValue(tx.billers_code, tx.response.meterNumber) || "";
  const meterType = tx.variation_code;
  const units = tx.response.units;

  // these values are pre-populated by preceeding parent
  const customerName = tx.response.customerName;
  const customerAddress = tx.response.customerAddress || "N/A";
  //TODO: which tx id should show
  const txId = getFirstValidValue(
    tx.request_id,
    tx.response.content?.transactions?.transactionId,
    tx.response.requestId
  );
  const tariff = tx.response.tariff;
  const taxAmount = tx.response.taxAmount;
  const debtAmount = tx.response.debtAmount;
  const debtAmountPaid = tx.response.energyPaymentBreakdown?.debtAmountPaid;
  const debtRemaining = tx.response.energyPaymentBreakdown?.debtRemaining;

  const txDate =
    dayjs(
      getFirstValidValue(tx.response.transaction_date, tx.updated_at)
    ).format("Do MMMM YYYY, h:mm A") || "N/A";

  const txPending = isTxPending(tx);
  const txSuccessful = isTxSuccessful(tx);
  const txReversed = tx.response?.code === "040";

  // polls status of pending tx
  useTxStatusPolling(tx, setTx);

  return (
    <ScreenBox inSafeArea={{ top: false }}>
      <Box rg={"l"} borderRadius={"m"}>
        {/* Header */}
        <Box variant={"surface"} alignItems={"center"} rg={"s"} pt={"xl"}>
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
          <ElectricityTopupStatusChip tx={tx} />
        </Box>

        {txSuccessful && token ? (
          <Box
            variant={"surface"}
            borderRightWidth={0}
            borderLeftWidth={0}
            borderColor={"textMuted"}
          >
            <Box
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box>
                <Text variant={"small"} color={"textMuted"}>
                  Token
                </Text>
                <Text fontFamily={"SpaceMono"} letterSpacing={1}>
                  {token}
                </Text>
              </Box>

              <Pressable
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

        <Box variant={"surface"} rg={"s"} pb={"xl"}>
          <Text fontFamily={"PrimaryBold"} variant={"small"}>
            Transaction Details
          </Text>
          <DetailText label={"Meter Number"} value={meterNo} />
          <DetailText label={"Customer Name"} value={customerName} />
          <DetailText label={"Customer Address"} value={customerAddress} />
          <DetailText label={"Phone"} value={tx.phone || "--"} />
          <DetailText label={"Service"} value={"Electricity"} />
          <DetailText
            label={"Meter Type"}
            value={meterType}
            textTransform={"uppercase"}
          />
          <DetailText label={"Amount Paid"} value={amount} />
          {units ? (
            <DetailText label={"Units Purchased"} value={units} />
          ) : null}
          <DetailText label={"Tariff"} value={tariff || "N/A"} />
          <DetailText label={"Tax"} value={formatCurrency(taxAmount || 0)} />
          <DetailText
            label={"Debt"}
            value={formatCurrency(tx.response?.debtAmount || 0)}
          />
          <DetailText
            label={"Debt Paid"}
            value={formatCurrency(debtAmountPaid || 0)}
          />
          <DetailText
            label={"Debt Remaining"}
            value={formatCurrency(debtRemaining || 0)}
          />

          <DetailText label={"Transaction ID"} value={txId} />
          <DetailText label={"Transaction Date"} value={txDate} />
        </Box>
      </Box>

      <Box flexDirection={"row"} alignSelf={"center"} mt={"l"} cg={"s"}>
        <Button
          label="Report"
          onPress={handleReportTransaction}
          style={{ flex: 1 }}
        />
        <Button
          label="Share Receipt"
          style={{ flex: 1 }}
          onPress={handleShareReceipt}
        />
      </Box>
    </ScreenBox>
  );
};

ElectricityTxDetailsScreen.displayName = "ElectricityTxDetailsScreen";

const useStyles = createStyleHook(({ zIndices }) => ({
  logo: {
    width: "40@s",
    height: "40@s",
    borderRadius: "20@s",
    aspectRatio: 1 / 1,
  },
}));
