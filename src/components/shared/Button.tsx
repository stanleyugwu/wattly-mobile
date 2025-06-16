import React, { FC } from "react";
import { ScaledSheet } from "react-native-size-matters";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";

import { Text } from "../ui";
import { palette } from "@/theme/palette";

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  label,
  onPress,
  style,
  loading = false,
  disabled = false,
  ...rest
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.button,
      style,
      (disabled || loading) && styles.disabled,
      { backgroundColor: palette.blue },
    ]}
    activeOpacity={disabled || loading ? 1 : 0.7}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <ActivityIndicator color={palette.white} size={20} />
    ) : (
      <Text textAlign={"center"} variant={"buttonText"}>
        {label}
      </Text>
    )}
  </TouchableOpacity>
);

const styles = ScaledSheet.create({
  button: {
    paddingVertical: "12@vs",
    paddingHorizontal: "24@s",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  disabled: {
    opacity: 0.7,
  },
});
