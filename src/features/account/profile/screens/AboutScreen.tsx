import Constants from "expo-constants";
import React, { type FC } from "react";
import { ScaledSheet } from "react-native-size-matters";

import { Box, Image, ScreenBox, Text } from "@/components";
import { Images } from "@assets/index";

interface AboutScreenProps {}

/**
 * Component for `About` screen
 */
export const AboutScreen: FC<AboutScreenProps> = (props) => {
  const version = Constants.expoConfig?.version;
  const appName = Constants.expoConfig?.name;

  return (
    <ScreenBox inSafeArea={{ top: false }} alignItems={"center"} rg={"l"}>
      <Image source={Images.icon} style={styles.logo} />
      <Box alignItems={"center"}>
        <Text>Version {version}</Text>
        <Text
          fontFamily={"PrimaryBold"}
          textTransform={"capitalize"}
          textAlign={"center"}
        >
          {appName}
        </Text>
      </Box>
    </ScreenBox>
  );
};

AboutScreen.displayName = "AboutScreen";

const styles = ScaledSheet.create({
  logo: {
    width: "100@s",
    height: "100@s",
    borderRadius: "10@s",
  },
});
