import React, { type FC } from "react";
import { s, ScaledSheet, vs } from "react-native-size-matters";

import { Box, Button, ScreenBox, Text, TextInput } from "@/components";
import { useAuth } from "@/contexts/auth";
import { useOverlayLoader } from "@/contexts/overlay_loader";
import { Toast } from "@/lib/toast";
import { useTheme } from "@/theme";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable } from "react-native";
import { verifyAccount } from "../api";
import { transferSchema } from "../schema";
import { TransferFormData } from "../types";

interface TransferScreenProps {}

/**
 * Component for `Transfer` screen
 */
export const TransferScreen: FC<TransferScreenProps> = (props) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const loader = useOverlayLoader();
  const { acct_no } = useLocalSearchParams();

  const { control, handleSubmit } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldUseNativeValidation: true,
    shouldFocusError: true,
    defaultValues: {
      accountNumber: acct_no?.toString() || undefined,
    },
  });

  const handleNext = handleSubmit(async (data) => {
    // Ensure balance sufficiency
    const balance = Number(user?.profile.balance);
    if (!balance || balance < +data.amount) {
      Toast.error(
        "Insufficient balance for transfer, please fund your account and try again"
      );
      return;
    }

    loader.show("Verifying account number...");
    try {
      const res = await verifyAccount(data.accountNumber);

      // prevent self-transfer
      if (
        res.email === user?.profile.email ||
        res.account_number === user?.profile.account_number
      ) {
        Toast.error("You can't transfer to your own account");
        return;
      }

      router.navigate({
        pathname: "/(protected)/transfer/confirmation/[amount]",
        params: {
          amount: data.amount,
          email: res.email,
          name: res.name,
          desc: data.description?.trim() || "",
          accountNumber: data.accountNumber,
        },
      });
    } catch (error) {
      Toast.error(
        "Account number invalid. Please check the number and try again"
      );
    } finally {
      loader.hide();
    }
  });

  return (
    <ScreenBox inSafeArea={{ top: false }} inkeyboardView rg={"l"}>
      <Box
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Text variant={"heading"}>Transfer</Text>
        {/* History */}
        <Pressable
          onPress={() =>
            router.navigate("/(protected)/transfer/transfer_history")
          }
        >
          <Box
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text variant={"caption"} fontFamily={"PrimaryBold"}>
              History
            </Text>
            <EvilIcons name="chevron-right" size={s(24)} color={colors.text} />
          </Box>
        </Pressable>
      </Box>

      {/* Scan QR Code */}
      <Pressable
        onPress={() => router.replace("/(protected)/transfer/qrcode_scan")}
      >
        <Box flexDirection={"row"} alignItems={"center"} cg={"xs"}>
          <Box bg={"surface"} borderRadius={"round"} p={"xs"}>
            <AntDesign name="qrcode" size={s(30)} color={colors.primary} />
          </Box>
          <Text flex={1} color={"primary"} fontFamily={"PrimaryBold"}>
            Scan an Account
          </Text>
        </Box>
      </Pressable>

      {/* Account Number */}
      <Box variant={"surface"} rg={"s"}>
        <Text variant={"body"} fontFamily={"PrimaryBold"}>
          Account Number
        </Text>
        <Controller
          name="accountNumber"
          control={control}
          render={({
            field: { value, onChange },
            formState: { defaultValues },
            fieldState: { error },
          }) => (
            <TextInput
              keyboardType="phone-pad"
              placeholder="Enter Recipient Account Number"
              value={value || defaultValues?.accountNumber}
              defaultValue={defaultValues?.accountNumber}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />
      </Box>

      {/* Amount */}
      <Box variant={"surface"} rg={"s"}>
        <Text variant={"body"} fontFamily={"PrimaryBold"}>
          Amount
        </Text>
        <Controller
          name="amount"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Box>
              <TextInput
                keyboardType="number-pad"
                placeholder="Enter Amount to Transfer"
                value={value}
                onChangeText={onChange}
                error={error?.message}
              />
              <Box position={"absolute"} right={s(10)} top={"25%"}>
                <Text variant={"small"} color={"textMuted"}>
                  NGN
                </Text>
              </Box>
            </Box>
          )}
        />
      </Box>

      {/* Description */}
      <Box variant={"surface"} rg={"s"}>
        <Text variant={"body"} fontFamily={"PrimaryBold"}>
          Description
        </Text>
        <Controller
          name="description"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={7}
              textAlignVertical="top"
              autoCapitalize={"sentences"}
              style={{ height: vs(120) }}
              returnKeyLabel="Next line"
              returnKeyType="next"
              placeholder="Narration/Description"
              error={error?.message}
            />
          )}
        />
      </Box>

      <Button label="Next" onPress={handleNext} />
    </ScreenBox>
  );
};

const styles = ScaledSheet.create({});
