import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState, type FC } from "react";
import { ScaledSheet } from "react-native-size-matters";

import {
  BottomSheet,
  BottomSheetRef,
  Box,
  Button,
  Image,
  Key,
  ScreenBox,
  SecureNumberPad,
  Text,
} from "@/components";
import { useAuth } from "@/contexts/auth";
import { useOverlayLoader } from "@/contexts/overlay_loader";
import { useSuccessOverlay } from "@/contexts/success_overlay";
import { queryClient, QueryKeys } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { formatCurrency } from "@/lib/utils";
import { Images } from "@assets/index";
import { transfer } from "../api";
import { PinInputs } from "../components";
import { TransferDetailsScreenParams } from "./TransferDetailsScreen";

const CELLS_COUNT = 4;

interface TransferConfirmationScreenProps {}

/**
 * Component for `TransferConfirmation` screen
 */
export const TransferConfirmationScreen: FC<TransferConfirmationScreenProps> = (
  props
) => {
  const pinSheetRef = useRef<BottomSheetRef>(null);
  const { user, syncProfile, signOut } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const { amount, email, name, desc, accountNumber } = useLocalSearchParams();

  const loader = useOverlayLoader();
  const successOverlay = useSuccessOverlay();

  const handleConfirm = async () => {
    pinSheetRef.current?.close();
    loader.show("Processing, please wait...");
    setPin("");

    try {
      const res = await transfer({
        account_number: accountNumber as string,
        amount: amount as string,
        description: desc as string,
        transaction_pin: pin,
      });

      // handle faulty transaction
      const newBalance = (+user?.profile.balance! || 0) - (+amount || 0);
      if (newBalance < 0) {
        signOut();
        logger.error(
          "User performed successfull transaction with insufficient wallet balance"
        );
      }

      syncProfile({
        ...user?.profile!,
        balance: newBalance.toString(),
      });
      Toast.success("Transfer successful");
      successOverlay.show({
        headingText: "Transfer successful",
        bodyText: `You have successfully transferred ${formatCurrency(
          +(amount as string) || 0
        )} to ${name}`,
        ctaLabel: "View receipt",
        onCTAPress: () => {
          successOverlay.hide();
          queryClient.invalidateQueries({
            queryKey: QueryKeys.getTransferTxs,
          });

          router.dismissTo({
            pathname: "/(protected)/transfer/transfer_details/[reference]",
            // @ts-expect-error
            params: res as TransferDetailsScreenParams,
          });
        },
      });
    } catch (error: any) {
      Toast.error(error.message);
    } finally {
      loader.hide();
    }
  };

  // auto-confirm pin
  useEffect(() => {
    if (pin.length === CELLS_COUNT) {
      if (pin !== user?.profile?.transaction_pin) {
        Toast.error("You entered an incorrect pin");
        setError(true);
      } else {
        setError(false);
        handleConfirm();
      }
    } else {
      setError(false);
    }
  }, [pin]);

  return (
    <>
      <ScreenBox inSafeArea={false}>
        <Box alignItems={"center"}>
          <Text variant={"heading3"}>Transfer</Text>
          <Text my={"xxs"}>to</Text>
          <Text
            variant={"heading3"}
            textTransform={"capitalize"}
            fontFamily={"PrimaryBold"}
          >
            {name}
          </Text>
          <Text variant={"small"}>({email})</Text>

          <Text mt={"s"}>Amount:</Text>
          <Text variant={"heading3"}>{formatCurrency(+amount || 0)}</Text>
        </Box>

        <Box variant={"surface"} mt={"xl"} rg={"s"} mb={"xxl"}>
          <Box style={styles.row}>
            <Text>Transaction Fee</Text>
            <Text>{formatCurrency(0)}</Text>
          </Box>

          <Box style={styles.row}>
            <Text>Network</Text>
            <Box style={styles.row} cg={"xxs"}>
              <Box borderRadius={"round"} p={"xxs"} bg={"background"}>
                <Image source={Images.iconSmall} style={styles.logo} />
              </Box>
              <Text>Wattlypay</Text>
            </Box>
          </Box>

          <Box rg={"xxs"}>
            <Text>Description</Text>
            {desc ? (
              <Box bg={"background"} p={"xs"} borderRadius={"s"} mt={"xxs"}>
                <Text variant={"small"}>{desc}</Text>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Button
          label="Confirm and send"
          onPress={() => pinSheetRef.current?.expand()}
        />
        <BottomSheet
          handleIndicatorStyle={{ display: "none" }}
          enableDynamicSizing={false}
          index={-1}
          ref={pinSheetRef}
          snapPoints={["70%"]}
        >
          <Box flex={1}>
            <Box
              justifyContent={"center"}
              alignItems={"center"}
              pb={"xl"}
              mb={"xxl"}
              rg={"l"}
            >
              <Text variant={"caption"} fontFamily={"PrimaryBold"}>
                Enter Your Transaction Pin to Proceed
              </Text>
              <PinInputs error={error} value={pin} />
            </Box>
            <SecureNumberPad
              onKeyPress={(key: Key) => {
                if (key === "del") {
                  setPin(pin.slice(0, -1));
                } else {
                  if (pin.length < CELLS_COUNT) {
                    setPin(pin + key);
                  }
                }
              }}
            />
          </Box>
        </BottomSheet>
      </ScreenBox>
    </>
  );
};

TransferConfirmationScreen.displayName = "TransferConfirmationScreen";

const styles = ScaledSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: "20@s",
    height: "20@s",
    borderRadius: 999,
  },
});
