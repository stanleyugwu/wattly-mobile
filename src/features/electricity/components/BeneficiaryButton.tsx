import { FC } from "react";
import { Pressable } from "react-native";

import { Box, Image, Text } from "@/components";
import { createStyleHook } from "@/lib/utils";
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
  const { palette, styles } = useStyles();

  return (
    <Pressable onPress={onSelect}>
      <Box
        variant={"elevated"}
        flexDirection={"row"}
        alignItems={"center"}
        mx={"s"}
        bg={"background"}
        style={{ shadowColor: palette.blue300 }}
        cg={"xs"}
      >
        <Box
          p={"xxs"}
          borderWidth={1}
          borderRadius={"round"}
          style={{ borderColor: palette.gray300 }}
        >
          <Image
            source={beneficiary.provider.logo}
            style={styles.providerLogo}
          />
        </Box>
        <Box flex={0.9} flexDirection={"column"}>
          <Text
            fontFamily={"PrimaryBold"}
            variant={"small"}
            flexShrink={1}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {beneficiary.provider.name}
          </Text>
          <Box flexDirection={"row"} alignItems={"center"} cg={"xs"} flex={1}>
            <Text variant={"small"} textTransform={"uppercase"}>
              {beneficiary.meterName}
            </Text>

            <Text variant={"small"} textTransform={"uppercase"}>
              {beneficiary.meterNo}
            </Text>
            <Text variant={"small"} textTransform={"uppercase"}>
              {beneficiary.meterType}
            </Text>
          </Box>
        </Box>

        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <EvilIcons name="trash" color={palette.white} size={s(19)} />
        </Pressable>
      </Box>
    </Pressable>
  );
};

const useStyles = createStyleHook(({ colors, spacing, borderRadii }) => ({
  deleteBtn: {
    position: "absolute",
    right: 0,
    backgroundColor: colors.error,
    padding: spacing.xs,
    borderTopLeftRadius: borderRadii.s,
    borderBottomLeftRadius: borderRadii.s,
  },
  providerLogo: {
    width: "35@s",
    height: "35@s",
    borderRadius: "25@s",
    aspectRatio: 1 / 1,
  },
}));
