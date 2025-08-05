import React, { type FC } from "react";
import { Linking } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import WebView from "react-native-webview";

import { Box } from "@/components";
import { WEBSITE } from "@/constants";

interface TermsAndConditionScreenProps {}

/**
 * Component for `TermsAndCondition` screen
 */
export const TermsAndConditionScreen: FC<TermsAndConditionScreenProps> = (
  _
) => {
  return (
    <Box flex={1}>
      <WebView
        style={{
          flex: 1,
        }}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.startsWith(WEBSITE!)) {
            return true; // allow
          }

          Linking.openURL(request.url);
          return false; // prevent WebView from handling it
        }}
        originWhitelist={["*"]}
        source={{ uri: WEBSITE! }}
      />
    </Box>
  );
};

TermsAndConditionScreen.displayName = "TermsAndConditionScreen";

const styles = ScaledSheet.create({});
