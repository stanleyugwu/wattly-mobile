import React, { useState, type FC } from "react";

import { Box } from "@/components";
import { WEBSITE } from "@/constants";
import { useAuth } from "@/contexts/auth";
import { useOverlayLoader } from "@/contexts/overlay_loader";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { getProfile } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { verifyWalletFunding } from "./api";
import { PaymentRef } from "./types";

interface WalletFundPaymentScreenProps {}

export const WalletFundPaymentScreen: FC<WalletFundPaymentScreenProps> = () => {
  const { payment_url, reference, provider } =
    useLocalSearchParams() as PaymentRef;
  const { syncProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasVerified, setHasVerified] = useState(false);
  const loader = useOverlayLoader();

  if (!payment_url || !reference || !provider) {
    logger.error(
      "WalletFundPaymentScreen:: Invalid or missing params (payment_url, reference, provider)"
    );
    router.back();
    return null;
  }

  const verifyPayment = async () => {
    try {
      loader.show("Verifying Payment...");
      const res = await verifyWalletFunding(reference, provider);
      Toast.success("Wallet funding successful");

      // after verification fetch profile to sync balance
      // but if that fails, we update balance in state
      try {
        const profile = await getProfile();
        syncProfile(profile);
      } catch (error) {
        // @ts-expect-error we can provide fewer fields, it would be merged with current state
        syncProfile({
          balance: res.balance?.toString(),
        });
        logger.error("Failed to fetch profile", { error });
      }
    } catch (err: any) {
      Toast.error("Something went wrong verifying your payment", {
        text1: "Verification Failed",
        text2: "Payment verification failed",
      });
      logger.error("WalletFundPaymentScreen:: Verification failed", {
        error: err,
      });
    } finally {
      loader.hide();
      router.dismissTo("/");
    }
  };

  const handleNavChange = (navState: any) => {
    const { url } = navState;
    // fallback: redirect back to WEBSITE
    if (!hasVerified && url.startsWith(WEBSITE)) {
      setHasVerified(true);
      verifyPayment();
      return false;
    }
    return true;
  };

  return (
    <Box style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
      )}
      <WebView
        source={{ uri: payment_url }}
        onLoadEnd={() => setLoading(false)}
        onHttpError={(error) =>
          logger.error("Payment Webview error", { error })
        }
        onShouldStartLoadWithRequest={handleNavChange}
        startInLoadingState
        onMessage={(event) => {
          const raw = event.nativeEvent.data;
          // sometimes providers send JSON; be defensive
          let msg = raw;
          try {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.type) msg = parsed.type;
          } catch {
            // not JSON — keep raw
          }

          if (!msg || hasVerified) return;

          if (msg === "payment-success") {
            setHasVerified(true);
            verifyPayment();
          } else if (msg === "payment-cancelled") {
            Alert.alert("Cancelled", "⚠️ Payment was cancelled.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          }
        }}
        injectedJavaScript={`
  (function() {
    function sendMessage(msg) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(msg);
    }

    // ---- Success detection (Paystack) ----
    const observer = new MutationObserver(() => {
      const successEl = document.querySelector('h2.success__title');
      if (successEl && successEl.innerText.includes("Payment Successful")) {
        sendMessage("payment-success-tag");
        observer.disconnect();
      }

      // ---- Paystack Cancel Button ----
      const paystackCancelSpan = document.querySelector('div.checkout__footer.mobile-only button span.text');
      if (paystackCancelSpan && paystackCancelSpan.innerText.includes("Cancel Payment")) {
        const btn = paystackCancelSpan.closest("button");
        if (btn && !btn.dataset.bound) {
          btn.dataset.bound = "true";
          btn.addEventListener("click", function () {
            sendMessage("payment-cancelled");
            observer.disconnect();
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ---- Flutterwave Cancel (hook into onclose) ----
    const originalOpen = window.open;
    window.open = function() {
      const popup = originalOpen.apply(this, arguments);
      try {
        if (popup && popup.flutterwaveCheckout) {
          const orig = popup.flutterwaveCheckout;
          popup.flutterwaveCheckout = function(config) {
            const newConfig = {
              ...config,
              onclose: function() {
                sendMessage("payment-cancelled");
                if (config.onclose) config.onclose();
              }
            };
            return orig(newConfig);
          };
        }
      } catch (e) {
        // fallback if injection fails
      }
      return popup;
    };
  })();
  true;
`}
      />
    </Box>
  );
};

WalletFundPaymentScreen.displayName = "WalletFundPaymentScreen";
