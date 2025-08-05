import React, { type FC } from "react";

import { Box } from "@/components";
import { WEBSITE } from "@/constants";
import { Linking } from "react-native";
import WebView from "react-native-webview";

interface PrivacyPolicyScreenProps {}

/**
 * Component for `PrivacyPolicy` screen
 */
export const PrivacyPolicyScreen: FC<PrivacyPolicyScreenProps> = (props) => {
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

PrivacyPolicyScreen.displayName = "PrivacyPolicyScreen";
