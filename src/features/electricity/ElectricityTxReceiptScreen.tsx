import { useLocalSearchParams } from "expo-router";
import React, { FC, useMemo, useRef } from "react";
import { View } from "react-native";
import ViewShot from "react-native-view-shot";

import { Box, Button, Image, ScreenBox, Text } from "@/components";
import {
  formatCurrency,
  shareReceiptAsImage,
  shareReceiptAsPdf,
} from "@/lib/utils";

import { useTheme } from "@/theme";
import { Images } from "@assets/index";
import type { ElectricityReceiptPayload } from "./types";

const RECEIPT_WIDTH = 360;

const ReceiptText: FC<React.ComponentProps<typeof Text>> = (props) => {
  const { palette, layout } = useTheme();
  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[
        {
          fontSize: 12,
          lineHeight: 18,
          color: palette.midnightSlate,
        },
        props.style,
      ]}
    />
  );
};

const ReceiptRow: FC<{ label: string; value: string }> = ({ label, value }) => {
  const { palette } = useTheme();
  return (
    <Box flexDirection="row" py={"xxs"}>
      <Box width={120}>
        <ReceiptText
          fontFamily={"PrimaryBlack"}
          style={{ fontSize: 11, color: palette.gray700 }}
        >
          {label}
        </ReceiptText>
      </Box>

      <Box width={RECEIPT_WIDTH - 160}>
        <ReceiptText style={{ textAlign: "right" }} numberOfLines={3}>
          {value}
        </ReceiptText>
      </Box>
    </Box>
  );
};

const ElectricityReceipt = React.forwardRef<
  ViewShot,
  { tx: ElectricityReceiptPayload }
>(({ tx }, ref) => {
  const { palette } = useTheme();
  const statusColor = useMemo(() => {
    switch (tx.txStatus) {
      case "successful":
        return palette.green;
      case "pending":
        return palette.orange;
      case "reversed":
        return palette.gray05;
      default:
        return palette.red;
    }
  }, [tx.txStatus]);

  return (
    <ViewShot
      ref={ref}
      options={{
        format: "png",
        quality: 1,
        width: RECEIPT_WIDTH,
      }}
    >
      <View
        style={{
          width: RECEIPT_WIDTH,
          backgroundColor: palette.white,
          padding: 16,
          paddingBottom: 0,
        }}
      >
        {/* HEADER */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          {tx.providerLogo ? (
            <Image
              source={{ uri: tx.providerLogo }}
              style={{ width: 48, height: 48, marginBottom: 8 }}
            />
          ) : null}

          <ReceiptText style={{ fontSize: 14, fontWeight: "700" }}>
            {tx.providerName}
          </ReceiptText>

          <ReceiptText
            style={{
              fontSize: 28,
              paddingTop: 16,
              fontWeight: "800",
            }}
          >
            {tx.amount}
          </ReceiptText>

          <View
            style={{
              marginTop: 8,
              paddingVertical: 4,
              paddingHorizontal: 14,
              borderRadius: 999,
              backgroundColor: `${statusColor}20`,
            }}
          >
            <ReceiptText
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: statusColor,
                textTransform: "capitalize",
              }}
            >
              {tx.txStatus}
            </ReceiptText>
          </View>
        </View>

        {/* TOKEN */}
        {tx.token ? (
          <View
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: palette.gray100,
              paddingVertical: 10,
              marginBottom: 12,
            }}
          >
            <ReceiptText
              fontFamily={"PrimaryBold"}
              style={{
                fontSize: 12,
                color: palette.gray700,
                marginBottom: 4,
              }}
            >
              Token
            </ReceiptText>

            <ReceiptText
              fontFamily={"PrimaryBold"}
              style={{
                fontSize: 13,
                color: palette.midnightSlate,
              }}
            >
              {tx.token}
            </ReceiptText>
          </View>
        ) : null}

        <ReceiptRow label="Meter Number" value={tx.meterNumber} />
        <ReceiptRow label="Customer Name" value={tx.customerName || "N/A"} />
        <ReceiptRow label="Customer Address" value={tx.customerAddress} />
        <ReceiptRow label="Phone" value={tx.phone || "--"} />
        <ReceiptRow label="Meter Type" value={tx.meterType.toUpperCase()} />
        <ReceiptRow label="Service" value={tx.service} />
        <ReceiptRow label="Units Purchased" value={tx.units || "--"} />
        <ReceiptRow label="Tax" value={formatCurrency(tx.taxAmount || 0)} />
        <ReceiptRow label="Tariff" value={tx.tariff || "N/A"} />
        <ReceiptRow label="Debt" value={formatCurrency(tx.debtAmount || 0)} />
        <ReceiptRow
          label="Debt Paid"
          value={formatCurrency(tx.debtAmountPaid || 0)}
        />
        <ReceiptRow
          label="Debt Remaining"
          value={formatCurrency(tx.debtRemaining || 0)}
        />
        <ReceiptRow label="Transaction ID" value={tx.txId} />
        <ReceiptRow label="Date" value={tx.txDate} />
        <Box
          backgroundColor={"primary"}
          width={"100%"}
          p={"xs"}
          alignItems={"center"}
          mt={"l"}
          justifyContent={"space-between"}
        >
          <Image
            source={Images.logo}
            tintColor={palette.white}
            style={{ width: 100, height: 48 }}
          />
          <View style={{ alignItems: "center" }}>
            <ReceiptText
              fontFamily={"PrimaryBold"}
              style={{ fontSize: 11, color: palette.white600 }}
            >
              This is a system-generated receipt
            </ReceiptText>
          </View>
        </Box>
      </View>
    </ViewShot>
  );
});

ElectricityReceipt.displayName = "ElectricityReceipt";

interface ElectricityTxReceiptScreenProps {}

export const ElectricityTxReceiptScreen: FC<
  ElectricityTxReceiptScreenProps
> = () => {
  const tx = useLocalSearchParams() as any as ElectricityReceiptPayload;
  const receiptRef = useRef<ViewShot>(null);

  if (!tx?.txId) {
    return <ScreenBox />;
  }

  return (
    <ScreenBox inSafeArea={{ top: false }}>
      <Box alignItems="center">
        <ElectricityReceipt ref={receiptRef} tx={tx} />
      </Box>

      <Box flexDirection="row" justifyContent="center" gap="s" mt="xl">
        <Button
          label="Share as Image"
          style={{ flex: 1 }}
          onPress={() =>
            shareReceiptAsImage(receiptRef, tx.txId, "Electricity")
          }
        />
        <Button
          label="Share as PDF"
          style={{ flex: 1 }}
          onPress={() => shareReceiptAsPdf(receiptRef, tx.txId)}
        />
      </Box>
    </ScreenBox>
  );
};

ElectricityTxReceiptScreen.displayName = "ElectricityTxReceiptScreen";
