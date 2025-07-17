import React, { FC, PropsWithChildren, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Portal } from "react-native-portalize";

import { Box, Text } from "@/components";
import { createStyleHook } from "@/lib/utils";
import { OverlayLoaderContext } from "./context";

/**
 * Provider for app-wide overlay loader
 */
export const OverlayLoaderProvider: FC<PropsWithChildren> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const { styles, colors } = useStyles();

  const show = (text?: string) => {
    setMessage(text || "Loading...");
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    setMessage("Loading...");
  };

  return (
    <OverlayLoaderContext.Provider value={{ show, hide }}>
      {children}
      <Portal>
        {visible && (
          <Box style={styles.overlay}>
            <Box justifyContent={"center"} alignItems={"center"} rg={"m"}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant={"body"}>{message}</Text>
            </Box>
          </Box>
        )}
      </Portal>
    </OverlayLoaderContext.Provider>
  );
};

const useStyles = createStyleHook(({ colors, zIndices }) => ({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: zIndices.overlay,
  },
}));
