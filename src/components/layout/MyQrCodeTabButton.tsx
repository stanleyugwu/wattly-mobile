import { createStyleHook } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import { s } from "react-native-size-matters";
import { Box } from "../ui";

interface MyQrCodeTabButtonProps extends PressableProps {
  onPress?: (a: any) => void;
  style: StyleProp<ViewStyle>;
}

/**
 * Renders customized qr code bottom tab button on home screen
 */
export const MyQrCodeTabButton: FC<MyQrCodeTabButtonProps> = ({
  onPress,
  style,
}) => {
  const { palette, styles } = useStyles();
  return (
    <Pressable onPress={onPress} style={[style, styles.container]}>
      <Box style={styles.containerInner}>
        <Ionicons name="qr-code-outline" color={palette.white} size={s(28)} />
      </Box>
    </Pressable>
  );
};

const useStyles = createStyleHook(({ borderRadii, spacing, colors }) => ({
  container: {
    borderRadius: borderRadii.round,
    backgroundColor: colors.surface,
    bottom: "50%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  containerInner: {
    borderRadius: borderRadii.round,
    width: "60@s",
    height: "60@s",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: colors.primary,
  },
}));
