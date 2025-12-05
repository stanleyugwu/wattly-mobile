import { router } from "expo-router";
import React, { useState } from "react";
import { ScaledSheet } from "react-native-size-matters";
import { useMutation } from "react-query";
import { z } from "zod";

import { ScreenBox } from "@/components/layout";
import { Button, Image } from "@/components/shared";
import { Box, Text, TextInput } from "@/components/ui";
import { QueryKeys } from "@/lib/api";
import { Toast } from "@/lib/toast";
import { Images } from "@assets/index";
import { forgotPassword } from "../services/api";

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const { isLoading, mutate } = useMutation({
    mutationFn: forgotPassword,
    mutationKey: QueryKeys.forgotPassword,
    onSuccess() {
      Toast.success(`Password reset OTP has been sent to ${email}`);
      router.push({
        pathname: "/auth/password/forgot/otp_verification/[email]",
        params: { email },
      });
    },
    onError(error: any) {
      Toast.error(error.message);
    },
  });

  const handleSendPasswordResetOtp = () => {
    const res = z
      .string()
      .email("Invalid email address")
      .trim()
      .safeParse(email);
    if (!res.success) return setEmailError(res.error.errors[0].message);
    mutate(email);
  };

  return (
    <ScreenBox inkeyboardView inSafeArea={{ top: false }}>
      <Image source={Images.logo} style={styles.logo} contentFit="contain" />
      <Text
        variant={"heading"}
        style={{ fontSize: 32 }}
        mt={"s"}
        textAlign={"center"}
      >
        Forgot your{"\n"}password?
      </Text>
      <Box
        borderWidth={2}
        borderColor={"text"}
        my={"s"}
        width={30}
        borderRadius={"round"}
        alignSelf={"center"}
      />
      <Text variant={"body"} color={"text"} textAlign={"center"}>
        Don't worry we all do! Just enter your email address below and we'll
        help you get back to your account
      </Text>

      <Box gap={"xxl"} pt={"xxl"} flex={1}>
        <Box gap={"xs"}>
          <Text>Email Address</Text>
          <TextInput
            value={email}
            onFocus={() => setEmailError("")}
            placeholder="Email Address"
            onSubmitEditing={handleSendPasswordResetOtp}
            onChangeText={(text) => setEmail(text)}
            error={emailError}
          />
        </Box>
        <Button
          label="Continue"
          loading={isLoading}
          style={{ marginTop: 40 }}
          onPress={handleSendPasswordResetOtp}
        />
      </Box>
    </ScreenBox>
  );
};

const styles = ScaledSheet.create({
  logo: {
    width: "200@s",
    height: "75@s",
    aspectRatio: 2 / 1,
  },
});
