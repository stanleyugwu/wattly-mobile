import React, { type FC } from "react";
import { s, ScaledSheet } from "react-native-size-matters";

import { Box, ScreenBox, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { logger } from "@/lib/logger";
import { useTheme } from "@/theme";
import { Images } from "@assets/index";
import { Entypo } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

interface MyQrCodeScreenProps {}

/**
 * Component for `MyQrCode` screen
 */
export const MyQrCodeScreen: FC<MyQrCodeScreenProps> = (props) => {
  const { palette, colors, layout, borderRadii } = useTheme();
  const QRCODE_SIZE = layout.screen.width * 0.7;
  const { user } = useAuth();
  const acctNo = user?.profile.account_number;

  const qrGradientColors = [
    "#229EFF", // Your primary color (Sky Blue)
    "#22FFD5", // Aqua
    "#34FF6B", // Lime Green
    "#F7FF3C", // Yellow
    "#FF9F1C", // Orange
    "#FF4C4C", // Red
    "#C22FFF", // Purple
    "#229EFF", // Loop back to primary for continuity
  ];

  return (
    <ScreenBox rg={"xl"}>
      <Box
        width={s(50)}
        height={s(50)}
        alignSelf={"center"}
        borderRadius={"round"}
        bg={"primary"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Entypo name="creative-cloud" color={palette.white} size={s(30)} />
      </Box>

      <Text textAlign={"center"}>
        To verify end - to - end sending and receiving of money, scan the QR
        Code on their device or ask them to scan your QR code.
      </Text>

      <Box
        alignSelf={"center"}
        marginVertical={"xl"}
        bg={"white"}
        borderRadius={"l"}
      >
        <QRCode
          quietZone={s(20)}
          onError={() => {
            logger.error("MyQrCodeScreen:: Qr code generation failed");
          }}
          linearGradient={qrGradientColors}
          enableLinearGradient
          logo={Images.icon}
          logoBackgroundColor={colors.primary}
          logoBorderRadius={borderRadii.round}
          value={acctNo}
          size={QRCODE_SIZE}
          color={colors.primary}
        />
      </Box>
      <Text textAlign={"center"}>
        Scan the above QR code using the sender's device
      </Text>
    </ScreenBox>
  );
};

MyQrCodeScreen.displayName = "MyQrCodeScreen";

const styles = ScaledSheet.create({
  qrcodeImg: {
    width: "300@s",
    marginVertical: "30@vs",
    height: "300@s",
    borderWidth: 1,
    alignSelf: "center",
  },
});
