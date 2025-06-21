import { Box } from "@/components";
import { createStyleHook } from "@/lib/utils";

import { Fontisto } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, PressableProps } from "react-native";
import { scale } from "react-native-size-matters";

interface NotificationIconBtnProps extends PressableProps {
  hasUnreadNotification: boolean;
}

/**
 *
 */
export const NotificationIconBtn: FC<NotificationIconBtnProps> = ({
  hasUnreadNotification,
  ...rest
}) => {
  const { styles, palette } = useTheme();

  return (
    <Pressable style={styles.container} {...rest}>
      <Box>
        <Fontisto name="bell" size={scale(18)} color={palette.gray900} />
        {hasUnreadNotification && (
          <Box style={styles.redDotContainer}>
            <Box style={styles.redDot} />
          </Box>
        )}
      </Box>
    </Pressable>
  );
};

const useTheme = createStyleHook(({ colors, palette }) => ({
  container: {
    width: "45@s",
    height: "45@s",
    backgroundColor: palette.blue100,
    borderRadius: "30@s",
    alignItems: "center",
    justifyContent: "center",
  },
  redDotContainer: {
    padding: "1.5@s",
    backgroundColor: colors.background,
    borderRadius: "10@s",
    width: "auto",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: "8@s",
    top: "1@vs",
  },
  redDot: {
    backgroundColor: colors.error,
    width: "5@s",
    height: "5@s",
    borderRadius: "5@s",
  },
}));
