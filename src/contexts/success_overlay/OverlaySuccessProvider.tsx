import React, { FC, PropsWithChildren, useRef, useState } from "react";
import { Portal } from "react-native-portalize";

import { Box, SuccessView } from "@/components";
import { createStyleHook } from "@/lib/utils";
import { StatusBar } from "expo-status-bar";
import { OverlaySuccessContext } from "./context";
import { ShowOptions } from "./types";

const initialState = {
  body: "Action completed successfully",
  heading: "Successful",
  ctaLabel: "Proceed",
};

/**
 * Provider for app-wide overlay success view
 */
export const OverlaySuccessProvider: FC<PropsWithChildren> = ({ children }) => {
  const { styles, colors, isDarkMode } = useStyles();
  const ctaFunction = useRef<VoidFunction>(null);

  const [visible, setVisible] = useState(false);
  const [texts, setTexts] = useState<{
    heading: string;
    body: string;
    ctaLabel: string;
  }>(initialState);

  const show = ({
    bodyText,
    headingText,
    onCTAPress,
    ctaLabel,
  }: ShowOptions) => {
    ctaFunction.current = onCTAPress; // save cta cb function in a ref for later use
    setTexts((prev) => ({
      ...prev,
      body: bodyText,
      heading: headingText,
      ctaLabel,
    }));
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    ctaFunction.current = null;
    setTexts(initialState);
  };

  return (
    <OverlaySuccessContext.Provider value={{ show, hide }}>
      {children}
      <Portal>
        {visible && (
          <Box style={styles.overlay}>
            <SuccessView
              ctaLabel={texts.ctaLabel}
              bodyText={texts.body}
              headingText={texts.heading}
              onCTAPress={ctaFunction.current || (() => {})}
            />
            <StatusBar
              backgroundColor={colors.surface}
              translucent
              hideTransitionAnimation="slide"
              animated
              style={isDarkMode ? "light" : "dark"}
            />
          </Box>
        )}
      </Portal>
    </OverlaySuccessContext.Provider>
  );
};

const useStyles = createStyleHook(({ insets, zIndices, colors }) => ({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingTop: insets.top,
    justifyContent: "center",
    alignItems: "center",
    zIndex: zIndices.overlay,
    paddingBottom: insets.bottom,
  },
}));
