import React, { useRef, useState, type FC } from "react";

import { Box, Button, ScreenBox, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { DetailText } from "@/features/electricity";
import {
  formatCurrency,
  shareReceiptAsImage,
  shareReceiptAsPdf,
} from "@/lib/utils";
import { useTheme } from "@/theme";
import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { s } from "react-native-size-matters";
import ViewShot from "react-native-view-shot";
import { TransferTransaction } from "../types";

export type TransferDetailsScreenParams = TransferTransaction;

interface TransferDetailsScreenProps {}

/**
 * Component for `TransferDetails` screen
 */
export const TransferDetailsScreen: FC<TransferDetailsScreenProps> = (
  props
) => {
  const {
    amount,
    sender_id,
    sender_name,
    description,
    recipient_name,
    reference,
    created_at,
    recipient_account_number,
    // @ts-expect-error
  } = useLocalSearchParams<TransferDetailsScreenParams>();
  const { palette, colors, borderRadii } = useTheme();
  const { user } = useAuth();
  const viewShotRef = useRef(null);
  const [sharingAsImage, setSharingAsImage] = useState(false);
  const [sharingAsPdf, setSharingAsPdf] = useState(false);

  const isSender =
    sender_id?.toString()?.trim() === user?.profile?.id?.toString().trim();

  const transferDate = dayjs(created_at).format("Do MMMM YYYY h:mm A");

  const handleShareAsImage = async () => {
    setSharingAsImage(true);
    try {
      await shareReceiptAsImage(viewShotRef, reference);
    } finally {
      setSharingAsImage(false);
    }
  };

  const handleShareAsPdf = async () => {
    setSharingAsPdf(true);
    try {
      await shareReceiptAsPdf(viewShotRef, reference);
    } finally {
      setSharingAsPdf(false);
    }
  };

  return (
    <ScreenBox inSafeArea={{ top: false }} rg={"l"}>
      <ViewShot
        ref={viewShotRef}
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadii.m,
        }}
        options={{ format: "png", quality: 1 }}
      >
        <Box variant={"surface"}>
          <Box mb={"xxl"} rg={"xxs"}>
            <Box
              borderRadius={"round"}
              alignItems={"center"}
              justifyContent={"center"}
              alignSelf={"center"}
              p={"xxs"}
              px={"xl"}
              style={{
                backgroundColor: palette.green200,
              }}
            >
              <Text
                variant={"small"}
                textAlign={"center"}
                fontFamily={"PrimaryBold"}
              >
                Transfer Successful{" "}
                <AntDesign name="checksquare" color={"green"} size={s(15)} />
              </Text>
            </Box>
            <Text variant={"small"} color={"textMuted"} textAlign={"center"}>
              On {transferDate}
            </Text>
          </Box>

          <Box rg={"m"}>
            <DetailText label="Amount" value={formatCurrency(+amount || 0)} />
            <DetailText
              label={isSender ? "Receipient Name" : "Received From"}
              value={isSender ? recipient_name : sender_name}
            />
            {isSender ? (
              <DetailText
                label="Account Number"
                value={recipient_account_number?.toString()}
              />
            ) : null}
            <DetailText label="Transaction ID" value={reference} />
            <Box rg={"xs"}>
              <DetailText label="Description:" value={""} />
              <Box bg={"background"} p={"s"} borderRadius={"s"}>
                <Text variant={"small"}>{description}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </ViewShot>

      <Box flexDirection={"row"} alignSelf={"center"} mt={"l"} cg={"s"}>
        <Button
          label="Share as PDF"
          onPress={handleShareAsPdf}
          loading={sharingAsPdf}
        />
        <Button
          label="Share as image"
          onPress={handleShareAsImage}
          loading={sharingAsImage}
        />
      </Box>
    </ScreenBox>
  );
};

TransferDetailsScreen.displayName = "TransferDetailsScreen";
