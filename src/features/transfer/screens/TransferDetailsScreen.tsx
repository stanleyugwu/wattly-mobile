import { Box, Button, Image, ScreenBox, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { DetailText } from "@/features/electricity";
import {
  formatCurrency,
  shareReceiptAsImage,
  shareReceiptAsPdf,
} from "@/lib/utils";
import { useTheme } from "@/theme";
import { Images } from "@assets/index";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, type FC } from "react";
import ViewShot from "react-native-view-shot";
import { TransferTransaction } from "../types";

export type TransferDetailsScreenParams = TransferTransaction;

interface TransferDetailsScreenProps {}

export const TransferDetailsScreen: FC<TransferDetailsScreenProps> = () => {
  const {
    amount,
    sender_id,
    sender_name,
    description,
    recipient_name,
    reference,
    created_at,
    recipient_account_number,
    // @ts-expect-error route parsm mistype
  } = useLocalSearchParams<TransferDetailsScreenParams>();

  const { palette, colors, borderRadii, isDarkMode } = useTheme();
  const { user } = useAuth();
  const viewShotRef = useRef(null);

  const isSender =
    sender_id?.toString().trim() === user?.profile?.id?.toString().trim();

  const transferDate = dayjs(created_at).format("Do MMMM YYYY • h:mm A");

  return (
    <ScreenBox inSafeArea={{ top: false }}>
      {/* RECEIPT */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={{
          width: 360,
          alignSelf: "center",
          backgroundColor: colors.surface,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: borderRadii.m,
        }}
      >
        {/* LOGO */}
        <Image
          source={Images.logo}
          tintColor={isDarkMode ? colors.white : undefined}
          style={{
            width: 96,
            height: 44,
            alignSelf: "center",
            marginBottom: 24,
          }}
        />

        {/* STATUS */}
        <Box alignItems="center" rg="xs" mb="xl">
          <Box
            px="l"
            py="xs"
            borderRadius="round"
            flexDirection="row"
            alignItems="center"
            cg="xs"
            style={{
              backgroundColor: palette.green200,
            }}
          >
            <Text variant="small" fontFamily="PrimaryBold" color="success">
              {isSender ? "Transfer Successful" : "Transaction Successful"}
            </Text>
            <AntDesign name="checkcircle" size={14} color={palette.green} />
          </Box>

          <Text variant="small" color="textMuted">
            {transferDate}
          </Text>
        </Box>

        {/* DETAILS */}
        <Box rg="m">
          <DetailText label="Amount" value={formatCurrency(+amount || 0)} />

          <DetailText
            label={isSender ? "Recipient Name" : "Received From"}
            value={isSender ? recipient_name : sender_name}
          />

          {isSender && recipient_account_number ? (
            <DetailText
              label="Account Number"
              value={recipient_account_number.toString()}
            />
          ) : null}

          <DetailText label="Transaction ID" value={reference} />

          {/* DESCRIPTION */}
          {description ? (
            <Box rg="xs">
              <DetailText label="Description" value="" />
              <Box bg="background" p="s" borderRadius="s">
                <Text variant="small">{description}</Text>
              </Box>
            </Box>
          ) : null}
        </Box>

        {/* FOOTER */}
        <Text variant="small" mt="xl" textAlign="center" color="textMuted">
          This is a system-generated receipt
        </Text>
      </ViewShot>

      {/* ACTIONS */}
      <Box flexDirection="row" justifyContent="center" mt="l" cg="s">
        <Button
          label="Share as Image"
          style={{ flex: 1 }}
          onPress={() =>
            shareReceiptAsImage(viewShotRef, reference, "Transfer")
          }
        />
        <Button
          label="Share as PDF"
          style={{ flex: 1 }}
          onPress={() => shareReceiptAsPdf(viewShotRef, reference)}
        />
      </Box>
    </ScreenBox>
  );
};

TransferDetailsScreen.displayName = "TransferDetailsScreen";
