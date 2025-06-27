import { Octicons } from "@expo/vector-icons";
import { FC, Fragment, useState } from "react";
import {
  TextInput as BaseTextInput,
  TextInputProps as BaseTextInputProps,
  Pressable,
} from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";

import { useTheme } from "@/theme";
import { Box } from "./Box";
import { Text } from "./Text";

export interface TextInputProps extends BaseTextInputProps {
  error?: string;
}

export const TextInput: FC<TextInputProps> = ({
  style,
  error = "",
  secureTextEntry,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(
    secureTextEntry ? false : true
  );
  const { palette, isDarkMode, colors, textVariants } = useTheme();
  const Wrapper = error ? Box : Fragment;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Wrapper>
      <BaseTextInput
        {...rest}
        secureTextEntry={secureTextEntry ? passwordVisible : false}
        placeholderTextColor={isDarkMode ? palette.gray700 : palette.gray300}
        style={[
          styles.textInput,
          {
            fontSize: textVariants.body.fontSize,
          },
          style,
          {
            borderColor: error ? palette.red : palette.gray300,
            color: colors.text,
          },
        ]}
      />
      {error ? (
        <Text variant={"small"} color={"error"} mt={"xxs"}>
          {error}
        </Text>
      ) : null}
      {secureTextEntry ? (
        <Pressable
          style={[styles.eyeIcon, error && { top: "19%" }]}
          onPress={togglePasswordVisibility}
          hitSlop={{ left: 30, right: 30, bottom: 20, top: 20 }}
        >
          <Octicons
            name={passwordVisible ? "eye" : "eye-closed"}
            color={colors.textMuted}
            size={scale(18)}
            adjustsFontSizeToFit
            allowFontScaling={false}
          />
        </Pressable>
      ) : null}
    </Wrapper>
  );
};

const styles = ScaledSheet.create({
  textInput: {
    padding: "14@s",
    borderRadius: "10@s",
    borderWidth: 1,
  },
  eyeIcon: { position: "absolute", right: "12@s", top: "55%", zIndex: 99 },
});
