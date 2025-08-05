import React, { useState, type FC } from "react";

import { Box } from "@/components";
import { WEBSITE } from "@/constants";
import { useAuth } from "@/contexts/auth";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { getProfile } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { verifyWalletFunding } from "./api";
import { PaymentRef } from "./types";

interface WalletFundPaymentScreenProps {}

/**
 * Component for `WalletFundPayment` screen
 */
export const WalletFundPaymentScreen: FC<WalletFundPaymentScreenProps> = (
  props
) => {
  const { payment_url, reference } = useLocalSearchParams() as PaymentRef;

  const { syncProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasVerified, setHasVerified] = useState(false); // prevent multiple verifications

  // invalid or missing payment url
  if (!payment_url || !reference) {
    logger.error(
      "WalletFundPaymentScreen:: Invalid or missing `payment_url` or `reference` parameter passed to screen"
    );
    router.back();
    return null;
  }

  const verifyPayment = async () => {
    try {
      await verifyWalletFunding(reference);
      Toast.success("Wallet funding successful");
      const profile = await getProfile();
      syncProfile(profile);
    } catch (err) {
      Toast.error("Something went wrong verifying your payment");
      logger.error("WalletFundPaymentScreen:: Wallet funding payment failed");
    } finally {
      router.dismissTo("/");
    }
  };

  const handleNavChange = (navState: any) => {
    const { url } = navState;
    if (!hasVerified && url.startsWith(WEBSITE)) {
      setHasVerified(true);
      verifyPayment();
    }
  };

  return (
    <Box style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
      )}
      <WebView
        source={{ uri: payment_url }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavChange}
        startInLoadingState
      />
    </Box>
  );
};

WalletFundPaymentScreen.displayName = "WalletFundPaymentScreen";
