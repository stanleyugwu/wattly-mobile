import * as Clipboard from "expo-clipboard";
import React, { type FC } from "react";
import { Pressable } from "react-native";
import { s, ScaledSheet } from "react-native-size-matters";

import { Box, Button, ScreenBox, Text } from "@/components";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

interface DetailBoxProps {
  detail: string;
}
const DetailBox: FC<DetailBoxProps> = ({ detail }) => {
  const { colors } = useTheme();
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(detail, {
        inputFormat: Clipboard.StringFormat.PLAIN_TEXT,
      });
      Toast.success("Copied");
    } catch (error) {
      logger.error("AddMoneyToWalletScreen:: Failed to copy text");
    }
  };

  return (
    <Box borderWidth={1} borderColor={"textMuted"} p={"s"} borderRadius={"l"}>
      <Text fontFamily={"PrimaryBold"}>{detail}</Text>
      <Pressable
        style={styles.copyBtn}
        hitSlop={{ left: 30, right: 20, top: 10, bottom: 10 }}
        onPress={handleCopy}
      >
        <Ionicons name="copy-outline" size={s(18)} color={colors.primary} />
      </Pressable>
    </Box>
  );
};

interface AddMoneyToWalletScreenProps {}

/**
 * Component for `AddMoneyToWallet` screen
 */
export const AddMoneyToWalletScreen: FC<AddMoneyToWalletScreenProps> = (_) => {
  const BANK_NAME = "Providus Bank";
  const ACCOUNT_NUMBER = "0561435285";
  const ACCOUNT_NAME = "Wattly Wallet Top-up";

  return (
    <ScreenBox inSafeArea={false} rg={"s"}>
      <Box variant={"surface"}>
        <Text>
          Use the details below to send money to your Wattlypay Account from any
          bank's app or through internet banking
        </Text>
      </Box>
      <Box variant={"surface"} rg={"xs"}>
        <Text mt={"s"}>Bank Name</Text>
        <DetailBox detail={BANK_NAME} />

        <Text mt={"s"}>Account Number</Text>
        <DetailBox detail={ACCOUNT_NUMBER} />

        <Text mt={"s"}>Account Name</Text>
        <DetailBox detail={ACCOUNT_NAME} />
      </Box>

      <Text textAlign={"center"} my={"l"}>
        Or
      </Text>
      <Button label="Top up with Flutterwave" />
    </ScreenBox>
  );
};

AddMoneyToWalletScreen.displayName = "AddMoneyToWalletScreen";

const styles = ScaledSheet.create({
  copyBtn: {
    position: "absolute",
    right: "4%",
    top: "50%",
    zIndex: 900,
  },
});
