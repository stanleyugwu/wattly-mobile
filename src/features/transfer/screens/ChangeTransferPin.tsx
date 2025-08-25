import React, { useState, type FC } from "react";
import { ScaledSheet } from "react-native-size-matters";

import { Box, Button, ScreenBox, Text, TextInput } from "@/components";
import { useAuth } from "@/contexts/auth";
import { useSuccessOverlay } from "@/contexts/success_overlay";
import { Toast } from "@/lib/toast";
import { requestAppStoreReview } from "@/lib/utils";
import { createTransactionPin } from "@/services/api";
import { useTheme } from "@/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator } from "react-native";
import { forgotTransferPin } from "../../account/profile/api";
import { changeTransferPinSchema } from "../../account/profile/schema";
import { ChangeTransferPinFormData } from "../../account/profile/types";

interface ChangeTransferPinScreenProps {}

/**
 * Component for `ChangeTransferPin` screen
 */
export const ChangeTransferPinScreen: FC<ChangeTransferPinScreenProps> = (
  props
) => {
  const { user, setTxPin } = useAuth();
  const { colors } = useTheme();
  const [changingPin, setChangingPin] = useState(false);
  const [sendingForgotOtp, setSendingForgotOtp] = useState(false);

  const successOverlay = useSuccessOverlay();

  const { control, handleSubmit, setError } =
    useForm<ChangeTransferPinFormData>({
      resolver: zodResolver(changeTransferPinSchema),
      mode: "onSubmit",
    });

  const handleChangePin = handleSubmit(async (data) => {
    if (data.oldPin !== user?.profile.transaction_pin)
      return setError("oldPin", { message: "Old pin is incorrect" });

    setChangingPin(true);
    try {
      await createTransactionPin(data.newPin);
      setTxPin(data.newPin);

      successOverlay.show({
        headingText: "Pin changed successfully",
        bodyText: "You have successfully reset your transaction pin",
        ctaLabel: "Continue",
        onCTAPress: () => {
          successOverlay.hide();
          requestAppStoreReview();
        },
      });
    } catch (error: any) {
      Toast.error(error.message);
    } finally {
      setChangingPin(false);
    }
  });

  const handleForgotPin = async () => {
    try {
      setSendingForgotOtp(true);
      await forgotTransferPin(user?.profile.email!);
      router.navigate("/(protected)/transfer/pin/reset_otp_verification");
    } catch (error) {
      Toast.error("Couldn't send forgot pin OTP, please try again");
    } finally {
      setSendingForgotOtp(false);
    }
  };

  return (
    <ScreenBox inkeyboardView inSafeArea={{ top: false }}>
      <Box gap={"xxl"} pt={"xxl"}>
        <Box gap={"xs"}>
          <Text>Old Pin</Text>
          <Controller
            control={control}
            name="oldPin"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextInput
                placeholder="Enter your old pin"
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                maxLength={4}
                value={value}
                keyboardType="number-pad"
                inputMode="numeric"
                error={error?.message}
                returnKeyLabel="Next"
                returnKeyType="next"
                enterKeyHint="next"
              />
            )}
          />
        </Box>

        <Box gap={"xs"}>
          <Text>New Pin</Text>
          <Controller
            control={control}
            name="newPin"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextInput
                placeholder="Enter a new pin"
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                maxLength={4}
                keyboardType="number-pad"
                inputMode="numeric"
                error={error?.message}
                returnKeyLabel="Next"
                returnKeyType="next"
                enterKeyHint="next"
              />
            )}
          />
        </Box>

        <Box gap={"xs"} mb={"xxl"}>
          <Text>Confirm New Pin</Text>
          <Controller
            control={control}
            name="confirmPin"
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextInput
                placeholder="Re-enter your new pin"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                maxLength={4}
                error={error?.message}
                keyboardType="number-pad"
                inputMode="numeric"
                submitBehavior="blurAndSubmit"
                returnKeyLabel="Done"
                returnKeyType="done"
                enterKeyHint="done"
              />
            )}
          />
        </Box>

        <Button
          label="Change Pin"
          onPress={handleChangePin}
          loading={changingPin}
        />

        {sendingForgotOtp ? (
          <ActivityIndicator size={"small"} color={colors.primary} />
        ) : (
          <Text
            textAlign={"center"}
            fontFamily={"PrimaryBold"}
            color={"primary"}
            textDecorationLine={"underline"}
            onPress={handleForgotPin}
          >
            Don't remember your old pin?
          </Text>
        )}
      </Box>
    </ScreenBox>
  );
};

ChangeTransferPinScreen.displayName = "ChangeTransferPinScreen";

const styles = ScaledSheet.create({});
