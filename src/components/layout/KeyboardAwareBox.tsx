import { FC } from "react";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from "react-native";

import { useTheme } from "@/theme";

interface KeyboardAwareBoxProps extends KeyboardAvoidingViewProps {}

/**
 * Wraps children in a keyboard aware view
 */
export const KeyboardAwareBox: FC<KeyboardAwareBoxProps> = ({ children }) => {
  const { insets } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
