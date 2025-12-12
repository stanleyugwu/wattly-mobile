import { Box, Image, Text } from "@/components";
import {
  createStyleHook,
  getElectricityProviderLogoFromText,
} from "@/lib/utils";
import { FC, memo } from "react";
import { Pressable } from "react-native";
import { ElectricityProvider } from "../types";

export interface ProviderButtonProps {
  onPress: (selectedProvider: ElectricityProvider & { logo: string }) => void;
  provider: ElectricityProvider;
}

/**
 * Renders pressable button with electricity provider details
 */
export const ProviderButton: FC<ProviderButtonProps> = memo(
  ({ onPress, provider }) => {
    const { styles, palette } = useStyles();
    const logo = getElectricityProviderLogoFromText(provider.name);

    return (
      <Pressable
        style={styles.providerBtn}
        onPress={() => onPress({ ...provider, logo })}
      >
        <Box
          p={"xxs"}
          borderWidth={1}
          borderRadius={"round"}
          style={{ borderColor: palette.gray300 }}
        >
          <Image source={logo} style={styles.providerLogo} />
        </Box>
        <Text variant={"small"} style={{ flex: 1, flexWrap: "wrap" }}>
          {provider.name}
        </Text>
      </Pressable>
    );
  }
);

const useStyles = createStyleHook(({ colors, spacing }) => ({
  providerBtn: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    paddingVertical: spacing.s,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: spacing.s,
    flex: 1,
  },
  providerLogo: {
    width: "30@s",
    height: "30@s",
    borderRadius: "10@s",
    aspectRatio: 1 / 1,
  },
}));
