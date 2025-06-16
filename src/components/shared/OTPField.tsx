import { FC, useEffect, useState } from "react";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

import { Box, Text } from "../ui";
import { Platform } from "react-native";
import { createStyleHook } from "@/lib/utils";

interface OTPFieldProps {
  cellCount?: number;
  isError?: boolean;
  onChangeText: (text: string) => void;
}

export const OTPField: FC<OTPFieldProps> = ({
  cellCount = 6,
  onChangeText,
  isError,
}) => {
  const { styles, colors } = useStyles();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    onChangeText?.(value);
  }, [value]);

  return (
    // @ts-expect-error
    <CodeField
      ref={ref}
      {...props}
      cellCount={cellCount}
      onChangeText={setValue}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete={Platform.select({
        android: "sms-otp",
        default: "one-time-code",
      })}
      renderCell={({ index, isFocused, symbol }) => (
        <Box
          key={index}
          style={[
            styles.cell,
            isFocused && styles.focusCell,
            isError && { borderColor: colors.error },
          ]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          <Text style={styles.cellText}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        </Box>
      )}
      value={value}
    />
  );
};

const useStyles = createStyleHook(({ colors, isDarkMode }) => ({
  codeFieldRoot: {
    marginTop: 20,
    justifyContent: "center",
  },
  cell: {
    width: "42@s",
    height: "45@s",
    lineHeight: "48@s",
    fontSize: "22@s",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: isDarkMode ? "#ffffff50" : "#00000020",
    textAlign: "center",
    marginHorizontal: "4@s",
    borderRadius: "6@s",
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    textAlign: "center",
    fontSize: "22@s",
    lineHeight: "30@s",
    color: colors.text,
    fontWeight: "bold",
  },
  focusCell: {
    borderColor: colors.primary,
  },
}));
