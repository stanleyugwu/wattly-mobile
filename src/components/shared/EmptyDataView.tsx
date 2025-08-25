import { FontAwesome5 } from "@expo/vector-icons";
import { FC } from "react";
import { s } from "react-native-size-matters";

import { useTheme } from "@/theme";
import { Box, Text } from "../ui";

interface EmptyDataViewProps {
  title?: string;
  body?: string;
}

/**
 * Renders customizable fallback view for empty data list
 */
export const EmptyDataView: FC<EmptyDataViewProps> = ({
  body = "No data was found here",
  title = "Nothing Found!",
}) => {
  const { colors } = useTheme();
  return (
    <Box justifyContent={"center"} alignItems={"center"} rg={"s"} py={"m"}>
      <FontAwesome5 name="box-open" size={s(35)} color={colors.textMuted} />
      <Box>
        <Text variant={"body"} textAlign={"center"} fontFamily={"PrimaryBold"}>
          {title}
        </Text>
        <Text variant={"body"} textAlign={"center"}>
          {body}
        </Text>
      </Box>
    </Box>
  );
};
