import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import React, { useEffect, useRef, useState, type FC } from "react";

import { Box, Text } from "@/components";
import { createStyleHook } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Button, Pressable } from "react-native";
import { s } from "react-native-size-matters";

interface QrCodeScanScreenProps {}

const CORNER_LENGTH = 30;
const CORNER_THICKNESS = 4;

/**
 * Component for `QrCodeScan` screen
 */
export const QrCodeScanScreen: FC<QrCodeScanScreenProps> = (_) => {
  const cameraRef = useRef<CameraView>(null);

  const [scannedData, setScannedData] = useState<string>("");

  const [permission, requestPermission] = useCameraPermissions();
  const { colors, styles, layout, spacing } = useStyles();

  const GUIDE_SIZE = layout.screen.width * 0.7;

  useEffect(() => {
    if (scannedData) {
      // auto navigate to transfer sceeen passing detected account number, after 1 second
      setTimeout(() => {
        router.replace({
          pathname: "/(protected)/transfer",
          params: {
            acct_no: scannedData,
          },
        });
      }, 800);
    }
  }, [scannedData]);

  if (!permission) {
    return <ActivityIndicator size={"small"} color={colors.primary} />;
  }

  if (!permission.granted) {
    return (
      <Box flex={1} justifyContent={"center"} mx="l" rg={"m"}>
        <Box>
          <Text variant={"heading3"} textAlign={"center"}>
            Camera Permission Required
          </Text>
          <Text textAlign={"center"}>
            We need your permission to access the camera to enable instant
            transfers
          </Text>
        </Box>
        <Button onPress={requestPermission} title="Grant permission" />
      </Box>
    );
  }

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scannedData && result.type === "qr") {
      const matchedAcctNo = result.data?.match(/\d{10}/)?.[0];
      if (matchedAcctNo) {
        setScannedData(matchedAcctNo);
        cameraRef.current?.pausePreview();
      }
    }
  };

  return (
    <Box style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"back"}
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
        ref={cameraRef}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <Box
        flex={1}
        p={"m"}
        position={"absolute"}
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={styles.contentContainer}
        rg={"m"}
      >
        {/* Back button */}
        <Pressable onPress={router.back}>
          <Box style={styles.backBtnContainer}>
            <Ionicons name="chevron-back" size={s(25)} color={colors.primary} />
          </Box>
        </Pressable>

        {/* Scan Text */}
        <Box justifyContent={"center"} alignItems={"center"}>
          <Text variant={"heading3"} textAlign={"center"} color={"white"}>
            Scan Account
          </Text>
          <Text textAlign={"center"} color={"white"}>
            Please, Point the camera at an account QR code
          </Text>
        </Box>

        {/* Scan Guide */}
        <Box
          width={GUIDE_SIZE}
          height={GUIDE_SIZE}
          position={"relative"}
          alignSelf={"center"}
          mt={"l"}
        >
          {/* Top left corner */}
          <Box
            style={styles.corner}
            top={0}
            left={0}
            borderLeftWidth={CORNER_THICKNESS}
            borderTopWidth={CORNER_THICKNESS}
          />

          {/* Top right corner */}
          <Box
            style={styles.corner}
            top={0}
            right={0}
            borderRightWidth={CORNER_THICKNESS}
            borderTopWidth={CORNER_THICKNESS}
          />

          {/* Bottom left corner */}
          <Box
            style={styles.corner}
            bottom={0}
            left={0}
            borderLeftWidth={CORNER_THICKNESS}
            borderBottomWidth={CORNER_THICKNESS}
          />
          {/* Bottom right corner */}
          <Box
            style={styles.corner}
            bottom={0}
            right={0}
            borderRightWidth={CORNER_THICKNESS}
            borderBottomWidth={CORNER_THICKNESS}
          />
        </Box>

        {/* Result */}
        {scannedData ? (
          <Box
            bg={"surface"}
            mt={"xxl"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"m"}
            p={"m"}
          >
            <Text fontFamily={"PrimaryBold"}>Account Number Detected:</Text>
            <Text fontFamily={"SpaceMono"} style={{ marginBottom: spacing.m }}>
              {scannedData}
            </Text>
            <ActivityIndicator size={"small"} color={colors.primary} />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

QrCodeScanScreen.displayName = "QrCodeScanScreen";

const useStyles = createStyleHook(
  ({ insets, palette, borderRadii, spacing }) => ({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    camera: {
      flex: 1,
    },
    corner: {
      position: "absolute",
      width: CORNER_LENGTH,
      height: CORNER_LENGTH,
      borderColor: palette.white,
      borderRadius: "4@s",
    },
    backBtnContainer: {
      backgroundColor: palette.white,
      marginTop: spacing.m,
      alignSelf: "flex-start",
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xs,
      width: "45@s",
      height: "45@s",
      borderRadius: borderRadii.round,
    },
    contentContainer: {
      flex: 1,
      paddingBottom: insets.bottom,
      paddingTop: insets.top,
    },
  })
);
