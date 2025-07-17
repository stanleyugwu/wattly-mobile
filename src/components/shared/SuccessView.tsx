import { FC } from "react";
import { ScaledSheet } from "react-native-size-matters";

import { useTheme } from "@/theme";
import { Images } from "@assets/index";
import { Box, Text } from "../ui";
import { Button } from "./Button";
import { Image } from "./Image";

interface SuccessViewProps {
  headingText: string;
  bodyText: string;
  onCTAPress: VoidFunction;
  ctaLabel: string;
}

/**
 * Renders a custom decorated success view and a CTA button
 */
export const SuccessView: FC<SuccessViewProps> = ({
  bodyText,
  headingText,
  ctaLabel = "Proceed",
  onCTAPress,
}) => {
  const { insets, isDarkMode, colors } = useTheme();
  return (
    <Box
      bg={"surface"}
      flex={1}
      p={"l"}
      style={{ paddingBottom: insets.bottom }}
      justifyContent={"center"}
      rg={"xl"}
    >
      <Box>
        <Text
          variant={"heading2"}
          textAlign={"center"}
          fontFamily={"PrimaryBold"}
        >
          {headingText}
        </Text>
        <Text textAlign={"center"} color={"textMuted"}>
          {bodyText}
        </Text>
      </Box>

      <Image
        contentFit="contain"
        source={Images.checkmark}
        style={styles.checkmark}
      />
      <Image
        contentFit="cover"
        source={Images.sitting_illustration}
        style={styles.sittingImage}
        tintColor={isDarkMode ? "white" : colors.primary}
      />

      <Button label={ctaLabel} onPress={onCTAPress} />
    </Box>
  );
};

const styles = ScaledSheet.create({
  checkmark: {
    width: "auto",
    height: "70@vs",
  },
  sittingImage: {
    width: "auto",
    height: "250@vs",
    alignSelf: "center",
    aspectRatio: 1 / 1,
  },
});
