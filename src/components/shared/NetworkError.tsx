import { useTheme } from "@/theme";
import { Fontisto } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import { Box, Text } from "../ui";

interface NetworkErrorProps {
  body?: string;
  onRetry: VoidFunction;
}

/**
 * Renders a network error view and retry button
 */
export const NetworkError: FC<NetworkErrorProps> = ({
  body = "Something went wrong!",
  onRetry,
}) => {
  const { colors } = useTheme();
  return (
    <Box alignItems={"center"} px="l" p="s">
      <Fontisto name="day-lightning" color={colors.text} size={scale(45)} />
      <Text
        textAlign={"center"}
        color={"textMuted"}
        fontFamily={"PrimaryBold"}
        mt={"xxs"}
      >
        {body}
      </Text>
      <Pressable onPress={onRetry}>
        <Box
          bg={"primary"}
          borderRadius={"xs"}
          mt={"s"}
          p={"xs"}
          px={"xxl"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text variant={"small"} color={"primaryText"}>
            Retry
          </Text>
        </Box>
      </Pressable>
    </Box>
  );
};

const styles = ScaledSheet.create({});
