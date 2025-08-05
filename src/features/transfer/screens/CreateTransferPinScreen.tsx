import React, { useState, type FC } from "react";
import { ScaledSheet, vs } from "react-native-size-matters";

import { Box, Button, OTPField, ScreenBox, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { useSuccessOverlay } from "@/contexts/success_overlay";
import { Toast } from "@/lib/toast";
import { createTransactionPin } from "@/services/api";
import { router } from "expo-router";

interface CreateTransferPinScreenProps {}

/**
 * Component for `CreateTransferPin` screen
 */
export const CreateTransferPinScreen: FC<CreateTransferPinScreenProps> = (
  props
) => {
  const [pin, setPin] = useState("");
  const [creatingPin, setCreatingPin] = useState(false);
  const { setTxPin } = useAuth();

  const successOverlay = useSuccessOverlay();

  const createPin = async () => {
    setCreatingPin(true);
    try {
      await createTransactionPin(pin);
      setTxPin(pin);
      successOverlay.show({
        headingText: "Pin set successfully",
        bodyText:
          "You have successfully set your transaction pin. Now you can make transfers",
        ctaLabel: "Continue",
        onCTAPress: () => {
          successOverlay.hide();
          router.navigate("/");
        },
      });
    } catch (error: any) {
      Toast.error(error.message);
    } finally {
      setCreatingPin(false);
    }
  };

  return (
    <ScreenBox>
      <Text variant={"heading"} textAlign={"center"}>
        Create Transaction Pin
      </Text>
      <Text textAlign={"center"}>
        For added security, create a pin for authentication of transactions
      </Text>

      <OTPField
        cellCount={4}
        onChangeText={(text) => {
          setPin(text);
        }}
      />

      <Box style={{ marginTop: vs(100) }}>
        <Button
          label="Continue"
          loading={creatingPin}
          disabled={pin.length != 4}
          onPress={createPin}
        />
      </Box>
    </ScreenBox>
  );
};

CreateTransferPinScreen.displayName = "CreateTransferPinScreen";

const styles = ScaledSheet.create({});
