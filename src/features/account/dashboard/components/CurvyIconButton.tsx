import { FC, ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";

import { Box, Text } from "@/components";
import { useTheme } from "@/theme";

interface CurvyIconButtonProps extends TouchableOpacityProps {
  Icon: ReactNode;
  label: string;
}

/**
 * Renders a pill button with icon
 */
export const CurvyIconButton: FC<CurvyIconButtonProps> = ({
  Icon,
  label,
  ...rest
}) => {
  const { palette } = useTheme();

  return (
    <TouchableOpacity {...rest} activeOpacity={1}>
      <Box
        flexDirection={"row"}
        alignItems={"center"}
        padding={"s"}
        borderRadius={"m"}
        cg={"xxs"}
        style={{ backgroundColor: palette.blue100 }}
      >
        {Icon}
        <Text
          variant={"small"}
          fontFamily={"PrimaryBold"}
          style={{ fontSize: scale(10), color: palette.gray900 }}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({});
