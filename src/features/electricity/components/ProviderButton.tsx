import { Box, Image, Text } from "@/components";
import { createStyleHook } from "@/lib/utils";
import { FC, memo } from "react";
import { Pressable } from "react-native";
import { ElectricityProvider } from "../types";

interface ProviderButtonProps {
  onPress: VoidFunction;
  provider: ElectricityProvider;
}

/**
 * Renders pressable button with electricity provider details
 */
export const ProviderButton: FC<ProviderButtonProps> = memo(
  ({ onPress, provider }) => {
    const { styles, palette } = useStyles();
    return (
      <Pressable style={styles.providerBtn} onPress={onPress}>
        <Box
          p={"xxs"}
          borderWidth={1}
          borderRadius={"round"}
          style={{ borderColor: palette.gray300 }}
        >
          <Image source={provider.logo} style={styles.providerLogo} />
        </Box>
        <Text fontFamily={"PrimaryBold"} style={{ flex: 1, flexWrap: "wrap" }}>
          {provider.name}
        </Text>
      </Pressable>
    );
  }
);

const useStyles = createStyleHook(({ colors, spacing }) => ({
  providerBtn: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: spacing.s,
    flex: 1,
  },
  providerLogo: {
    width: "35@s",
    height: "35@s",
    borderRadius: "25@s",
    aspectRatio: 1 / 1,
  },
}));
