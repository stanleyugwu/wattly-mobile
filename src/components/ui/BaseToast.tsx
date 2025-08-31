import { FC } from "react";
import { ViewStyle } from "react-native";
import { scale, vs } from "react-native-size-matters";
import Toast, {
  ErrorToast,
  InfoToast,
  SuccessToast,
  ToastProps,
} from "react-native-toast-message";

import { useTheme } from "@/theme";
import { ToastType } from "@/types";

const TOAST_HEIGHT = vs(15);
const TOAST_FONT_SIZE = scale(11);

export const BaseToast: FC<ToastProps> = () => {
  const { colors, insets } = useTheme();

  const text1Style = { color: colors.textMuted };
  const text2Style = { color: colors.textMuted, fontSize: TOAST_FONT_SIZE };
  const containerStyle: ViewStyle = {
    backgroundColor: colors.surface,
    height: "auto",
    paddingVertical: TOAST_HEIGHT,
    flexWrap: "wrap",
    marginBottom: insets.bottom / 2,
  };

  return (
    <Toast
      config={{
        [ToastType.Success]: (props) => {
          return (
            <SuccessToast
              {...props}
              text1Style={[props.text1Style, text1Style]}
              text2Style={[props.text2Style, text2Style]}
              text2NumberOfLines={4}
              style={{
                ...containerStyle,
                borderLeftColor: colors.success,
              }}
            />
          );
        },
        [ToastType.Error]: (props) => {
          return (
            <ErrorToast
              {...props}
              text2NumberOfLines={4}
              text1Style={[props.text1Style, text1Style]}
              text2Style={[props.text2Style, text2Style]}
              style={{
                ...containerStyle,
                borderLeftColor: colors.error,
              }}
            />
          );
        },
        [ToastType.Info]: (props) => {
          return (
            <InfoToast
              {...props}
              text1Style={[props.text1Style, text1Style]}
              text2Style={[props.text2Style, text2Style]}
              text2NumberOfLines={4}
              style={{
                ...containerStyle,
                borderLeftColor: colors.warning,
              }}
            />
          );
        },
      }}
    />
  );
};
