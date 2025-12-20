import { FC } from "react";
import { Pressable } from "react-native";

import { Box, Image, Text } from "@/components";
import {
  createStyleHook,
  getElectricityProviderLogoFromText,
} from "@/lib/utils";
import { Images } from "@assets/index";
import { EvilIcons } from "@expo/vector-icons";
import { s } from "react-native-size-matters";
import { SavedBeneficiary } from "../types";

interface BeneficiaryButtonProps {
  onSelect: VoidFunction;
  beneficiary: SavedBeneficiary;
  onDelete: VoidFunction;
}

/**
 * Renders a pressable saved beneficiary details
 */
export const BeneficiaryButton: FC<BeneficiaryButtonProps> = ({
  onDelete,
  onSelect,
  beneficiary,
}) => {
  const { palette, styles, colors } = useStyles();
  return (
    <Pressable onPress={onSelect}>
      <Box
        variant={"surface"}
        borderWidth={1}
        borderColor={"border"}
        flexDirection={"row"}
        alignItems={"center"}
        bg={"background"}
        cg={"xs"}
      >
        <Box
          p={"xxs"}
          borderWidth={1}
          flexShrink={0}
          borderRadius={"round"}
          style={{ borderColor: palette.gray300 }}
        >
          <Image
            source={getElectricityProviderLogoFromText(
              beneficiary.provider.name
            )}
            placeholder={Images.icon}
            style={styles.providerLogo}
          />
        </Box>
        <Box flexDirection={"column"} flexShrink={1}>
          <Box flexDirection={"row"} alignItems={"center"} cg={"s"}>
            <Text
              fontFamily={"PrimaryBold"}
              variant={"caption"}
              flexShrink={1}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {beneficiary.provider.name}
            </Text>
            <Pressable style={styles.deleteBtn} onPress={onDelete}>
              <EvilIcons name="trash" color={colors.error} size={s(16)} />
            </Pressable>
          </Box>
          <Box
            flexDirection={"row"}
            flexWrap={"wrap"}
            alignItems={"center"}
            cg={"xs"}
          >
            <Text variant={"caption"}>{beneficiary.meterName}</Text>
            <Text variant={"caption"}>{beneficiary.meterNo}</Text>
            <Text variant={"caption"}>{beneficiary.meterType}</Text>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
};

const useStyles = createStyleHook(({ colors, spacing, borderRadii }) => ({
  deleteBtn: {
    flexShrink: 0,
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.xs,
    borderRadius: borderRadii.xs,
  },
  providerLogo: {
    width: "30@s",
    height: "30@s",
    borderRadius: "15@s",
    aspectRatio: 1 / 1,
  },
}));
