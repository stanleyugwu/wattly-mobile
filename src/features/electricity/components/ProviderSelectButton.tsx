import { Box, Image, Text } from "@/components";
import { createStyleHook } from "@/lib/utils";
import { Images } from "@assets/index";
import { EvilIcons } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable } from "react-native";
import { scale } from "react-native-size-matters";

interface ProviderSelectButtonProps {
  provider: string;
  logo: string;
  onPress: VoidFunction;
}

/**
 * Renders a service provider select option button
 */
export const ProviderSelectButton: FC<ProviderSelectButtonProps> = ({
  logo,
  provider,
  onPress,
}) => {
  const { colors, styles, palette } = useStyles();
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Box flexDirection="row" alignItems="center" flex={1} cg={"xs"}>
        <Box
          p="xxs"
          borderWidth={1}
          borderRadius="round"
          alignItems="center"
          justifyContent="center"
          style={{
            borderColor: palette.gray300,
          }}
        >
          <Image
            source={logo?.trim() ? logo : Images.iconSmall}
            style={styles.logo}
          />
        </Box>

        <Text
          variant="small"
          numberOfLines={2}
          fontFamily={"PrimaryBold"}
          ellipsizeMode="tail"
          flexShrink={1}
        >
          {provider}
        </Text>
      </Box>

      <EvilIcons
        name="chevron-right"
        color={colors.text}
        size={scale(24)}
        style={{ flexShrink: 0 }}
      />
    </Pressable>
  );
};

const useStyles = createStyleHook(({ spacing, isDarkMode, palette }) => ({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: spacing.xs,
  },
  logo: {
    width: "30@s",
    height: "30@s",
    borderRadius: "15@s",
    aspectRatio: 1 / 1,
  },
}));
