import React, { useState, type FC } from "react";

import { Box, Button, ScreenBox, Text, TextInput } from "@/components";
import { useAuth } from "@/contexts/auth";
import { useSuccessOverlay } from "@/contexts/success_overlay";
import { Toast } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { resetTransferPin } from "../../account/profile/api";
import { transferPinResetSchema } from "../../account/profile/schema";
import { ResetTransferPinFormData } from "../../account/profile/types";

interface ResetTransferPinScreenProps {}

/**
 * Component for `ResetTransferPin` screen
 */
export const ResetTransferPinScreen: FC<ResetTransferPinScreenProps> = (
  props
) => {
  const { setTxPin } = useAuth();
  const [changingPin, setResettingPin] = useState(false);

  const successOverlay = useSuccessOverlay();
  const { otp, email } = useLocalSearchParams();

  const { control, handleSubmit } = useForm<ResetTransferPinFormData>({
    resolver: zodResolver(transferPinResetSchema),
    mode: "onSubmit",
  });

  const handleResetPin = handleSubmit(async (data) => {
    setResettingPin(true);
    try {
      await resetTransferPin({
        email: email as string,
        otp: otp as string,
        new_pin: data.newPin,
        new_pin_confirmation: data.confirmPin,
      });
      setTxPin(data.newPin);

      successOverlay.show({
        headingText: "Pin reset successfully",
        bodyText: "You have successfully reset your transaction pin",
        ctaLabel: "Continue",
        onCTAPress: () => {
          successOverlay.hide();
          router.replace("/");
        },
      });
    } catch (error: any) {
      Toast.error(error.message);
    } finally {
      setResettingPin(false);
    }
  });

  return (
    <ScreenBox inkeyboardView inSafeArea={{ top: false }}>
      <Box gap={"xxl"} pt={"xxl"}>
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
                maxLength={4}
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                keyboardType="number-pad"
                inputMode="numeric"
                error={error?.message}
                submitBehavior="blurAndSubmit"
                returnKeyLabel="Done"
                returnKeyType="done"
                enterKeyHint="done"
              />
            )}
          />
        </Box>

        <Button
          label="Reset Pin"
          onPress={handleResetPin}
          loading={changingPin}
        />
      </Box>
    </ScreenBox>
  );
};

ResetTransferPinScreen.displayName = "ResetTransferPinScreen";
