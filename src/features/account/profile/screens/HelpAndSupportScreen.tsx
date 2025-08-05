import React, { type FC } from "react";
import { ScaledSheet } from "react-native-size-matters";

import { Box } from "@/components";
import { WEBSITE } from "@/constants";
import { Linking } from "react-native";
import WebView from "react-native-webview";

interface HelpAndSupportScreenProps {}

/**
 * Component for `HelpAndSupport` screen
 */
export const HelpAndSupportScreen: FC<HelpAndSupportScreenProps> = (props) => {
  return (
    <Box flex={1}>
      <WebView
        style={{
          flex: 1,
        }}
        onShouldStartLoadWithRequest={(request) => {
          // Keep navigation inside WebView for same-origin links
          if (request.url.startsWith(WEBSITE!)) {
            return true; // allow
          }

          // For external links, open in-app (optional) or block
          // If you want to open external links in browser manually:
          Linking.openURL(request.url);
          return false; // prevent WebView from handling it
        }}
        originWhitelist={["*"]}
        source={{ uri: `${WEBSITE}/contact` }}
      />
    </Box>
  );
};

HelpAndSupportScreen.displayName = "HelpAndSupportScreen";

const styles = ScaledSheet.create({});
