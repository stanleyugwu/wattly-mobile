import * as Clipboard from "expo-clipboard";
import React, { useRef, useState, type FC } from "react";
import { ActivityIndicator, Keyboard, Linking, Pressable } from "react-native";
import { s, ScaledSheet } from "react-native-size-matters";

import {
  BottomSheet,
  BottomSheetRef,
  Box,
  Button,
  NetworkError,
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
import { useGetPaymentMetadata } from "./hooks";
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

  const { colors } = useTheme();

  const {
    data: paymentMetadata,
    isLoading: isLoadingPaymentMetadata,
    refetch,
    isError,
  } = useGetPaymentMetadata();

  const BANK_NAME = paymentMetadata?.bankdetail?.bankName || "--";
  const ACCOUNT_NUMBER = paymentMetadata?.bankdetail?.accountNumber || "--";
  const ACCOUNT_NAME = paymentMetadata?.bankdetail?.accountName || "--";

  const isPaystackAvailable = paymentMetadata?.paystack;
  const isFlutterwaveAvailable = paymentMetadata?.flutterwave;

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

  const contactAdmin = () => {
    const message = "Hello, I just made a manual payment.";
    // contact on whatsapp
    const phoneNumber = paymentMetadata?.phone || "";
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      ).catch((error) => {
        logger.error("AddMoneyToWalletScreen:: Failed to open whatsapp web", {
          error,
        });
      });
    });
  };

  return (
    <>
      <ScreenBox inSafeArea={false} rg={"s"}>
        <Box variant={"surface"}>
          <Text variant={"small"} textAlign={"center"}>
            Choose any of the options below to fund your Wattly Account: Use any
            of the available instant payment methods or transfer via the bank
            details provided.
          </Text>
        </Box>

        {isLoadingPaymentMetadata ? (
          <Box rg={"s"} alignItems={"center"} mt={"l"}>
            <ActivityIndicator size={18} color={colors.primary} />
            <Text variant={"small"}>Loading payment options</Text>
          </Box>
        ) : isError ? (
          <Box variant={"surface"} my={"l"}>
            <NetworkError
              onRetry={refetch}
              body="Couldn't load available payment options, please retry"
            />
          </Box>
        ) : null}

        {isPaystackAvailable && (
          <Button
            label="Top up with Paystack"
            onPress={() => {
              selectedProvider.current = "paystack";
              amountSheetRef.current?.expand();
            }}
          />
        )}

        {isFlutterwaveAvailable && (
          <Button
            label="Top up with Flutterwave"
            onPress={() => {
              selectedProvider.current = "flutterwave";
              amountSheetRef.current?.expand();
            }}
          />
        )}

        {(isFlutterwaveAvailable || isPaystackAvailable) && (
          <Text textAlign={"center"} my={"l"}>
            Or
          </Text>
        )}

        {paymentMetadata && (
          <Box variant={"surface"} rg={"xs"}>
            <Text variant={"small"} textAlign={"center"} mb={"m"}>
              Make a manual transfer using the details below. After payment,
              please contact the admin to verify your transaction.
            </Text>

            <Text mt={"s"}>Bank Name</Text>
            <DetailBox detail={BANK_NAME} />

            <Text mt={"s"}>Account Number</Text>
            <DetailBox detail={ACCOUNT_NUMBER} />

            <Text mt={"s"}>Account Name</Text>
            <DetailBox detail={ACCOUNT_NAME} />

            <Box alignItems={"center"} mt={"l"}>
              <Button label="Contact Admin" onPress={contactAdmin} />
            </Box>
          </Box>
        )}
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
