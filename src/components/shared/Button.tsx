import React, { FC } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import { palette } from "@/theme/palette";
import { Text } from "../ui";

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
      <Text
        textAlign={"center"}
        variant={"body"}
        fontFamily={"PrimaryBold"}
        color={"white"}
        width={"100%"}
      >
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
