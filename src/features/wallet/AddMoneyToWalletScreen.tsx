import * as Clipboard from "expo-clipboard";
import React, { useRef, useState, type FC } from "react";
import { Keyboard, Pressable } from "react-native";
import { s, ScaledSheet } from "react-native-size-matters";

import {
  BottomSheet,
  BottomSheetRef,
  Box,
  Button,
  ScreenBox,
  Text,
  TextInput,
} from "@/components";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getPaymentRef } from "./api";
import { PaymentProvider } from "./types";

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
      logger.error("AddMoneyToWalletScreen:: Failed to copy text", { error });
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
  const [loading, setLoading] = useState(false);
  const amountSheetRef = useRef<BottomSheetRef>(null);
  const [amount, setAmount] = useState("");
  const selectedProvider = useRef<PaymentProvider>("paystack");

  const BANK_NAME = "--";
  const ACCOUNT_NUMBER = "--";
  const ACCOUNT_NAME = "--";

  const amtInsufficient =
    !parseFloat(amount) || +amount < 100 || +amount > 1000000;

  const handleTopUp = async () => {
    try {
      setLoading(true);
      Keyboard.dismiss();

      const ref = await getPaymentRef(amount, selectedProvider.current);
      if (ref?.payment_url && ref?.reference) {
        router.navigate({
          pathname: "/(protected)/wallet/add_money/[payment_url]",
          params: {
            payment_url: ref.payment_url,
            reference: ref.reference,
            provider: selectedProvider.current,
          },
        });
        amountSheetRef.current?.close();
      } else throw new Error("Failed to get payment reference");
    } catch (error: any) {
      logger.error(error.message || "Failed to get payment reference", {
        error,
      });
      Toast.error(error.message, { position: "top" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScreenBox inSafeArea={false} rg={"s"}>
        <Box variant={"surface"}>
          <Text>
            Use the details below to send money to your Wattlypay Account from
            any bank's app or through internet banking
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

        <Button
          label="Top up with Paystack"
          onPress={() => {
            selectedProvider.current = "paystack";
            amountSheetRef.current?.expand();
          }}
        />
        <Button
          label="Top up with Flutterwave"
          onPress={() => {
            selectedProvider.current = "flutterwave";
            amountSheetRef.current?.expand();
          }}
        />
      </ScreenBox>

      <BottomSheet
        enableDynamicSizing={false}
        index={-1}
        keyboardBehavior="extend"
        snapPoints={["70%"]}
        ref={amountSheetRef}
      >
        <Box flex={1} rg={"xs"}>
          <Text variant={"heading3"} textAlign={"center"}>
            Wallet Top Up
          </Text>

          <Box mt={"xxl"} rg={"l"}>
            <TextInput
              keyboardType="numeric"
              inputMode="decimal"
              value={amount}
              onChangeText={(text) => setAmount(text.trim())}
              placeholder="Amount to fund"
            />
            <Button
              label="Continue"
              disabled={amtInsufficient}
              onPress={handleTopUp}
              loading={loading}
            />
          </Box>
        </Box>
      </BottomSheet>
    </>
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
