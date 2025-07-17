import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";
import { useMutation } from "react-query";

import { Box, Button, Image, OTPField, ScreenBox, Text } from "@/components";
import { QueryKeys } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { FontName, useTheme } from "@/theme";
import { Images } from "@assets/index";
import { forgotPassword, verifyPasswordResetEmail } from "../services/api";

const OTP_COUNT = 6;
const COUNTDOWN = 30;

export const ForgotPasswordOtpVerificationScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { colors } = useTheme();

  const [otp, setOtp] = useState<string>("");
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const { isLoading: isVerifyingOtp, mutate } = useMutation({
    mutationFn: verifyPasswordResetEmail,
    mutationKey: QueryKeys.verifyPasswordResetEmail,
    onSuccess(data) {
      console.log(data);
      router.navigate({
        pathname: "/auth/password/reset/[email]",
        params: { email },
      });
    },
    onError(error: any) {
      console.log(error);
      setOtpError(true);
      Toast.error(error.message);
    },
  });

  const handleVerifyOtp = (otp: string) => {
    if (!isVerifyingOtp && !resendingOtp) mutate(otp);
  };

  const handleOtpInput = useCallback((_otp: string) => {
    setOtpError(false);
    setOtp(_otp);
    // auto verify upon complete entry
    if (_otp.length === OTP_COUNT) handleVerifyOtp(_otp);
  }, []);

  const handleResendOtp = () => {
    setResendingOtp(true);
    forgotPassword(email)
      .then((res) => {
        Toast.success(`New OTP Sent to ${email}`);
      })
      .catch((error) => {
        logger.error(
          `ForgotPasswordOtpVerification:: OTP Not Resent: ${error}`
        );
        Toast.error("OTP not resent, Please try again");
      })
      .finally(() => {
        setResendingOtp(false);
        setCountdown(COUNTDOWN);
      });
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScreenBox>
        <Image source={Images.logo} style={styles.logo} contentFit="contain" />
        <Text
          variant={"heading"}
          style={{ fontSize: 32 }}
          mt={"s"}
          textAlign={"center"}
        >
          Let's verify{"\n"}it's you!
        </Text>
        <Box
          borderWidth={2}
          borderColor={"text"}
          my={"s"}
          width={30}
          borderRadius={"round"}
          alignSelf={"center"}
        />
        <Text variant={"body"} textAlign={"center"}>
          A one-time pin (OTP) code has been sent to{" "}
          <Text style={{ fontFamily: FontName.PrimaryBold }}>{email}</Text>.
          Please enter the code below to verify your identity and continue with
          password reset.
        </Text>

        <Box gap={"xxl"} pt={"xxl"} flex={1}>
          <OTPField
            isError={otpError}
            cellCount={OTP_COUNT}
            onChangeText={handleOtpInput}
          />
          {countdown === 0 ? (
            !resendingOtp &&
            !isVerifyingOtp && (
              <Text
                onPress={handleResendOtp}
                textAlign={"center"}
                textDecorationLine={"underline"}
                variant={"body"}
                color={"primary"}
                style={{ fontFamily: FontName.PrimaryBold }}
              >
                Resend code
              </Text>
            )
          ) : (
            <Text textAlign={"center"}>
              Resend code in{" "}
              <Text style={{ fontFamily: FontName.PrimaryBold }}>
                {countdown}
              </Text>
            </Text>
          )}

          {(isVerifyingOtp || resendingOtp) && (
            <Box gap={"xs"} alignItems={"center"}>
              <ActivityIndicator size={scale(25)} color={colors.primary} />
              <Text variant={"small"}>
                {isVerifyingOtp ? "Verifying OTP..." : "Resending OTP..."}
              </Text>
            </Box>
          )}

          <Button
            label="Confirm"
            disabled={!otp || otp.length !== OTP_COUNT || resendingOtp}
            loading={isVerifyingOtp}
            style={{ marginTop: 40 }}
            onPress={() => handleVerifyOtp(otp)}
          />
        </Box>
      </ScreenBox>
    </KeyboardAvoidingView>
  );
};

const styles = ScaledSheet.create({
  logo: {
    width: "200@s",
    height: "75@s",
    aspectRatio: 2 / 1,
  },
});
