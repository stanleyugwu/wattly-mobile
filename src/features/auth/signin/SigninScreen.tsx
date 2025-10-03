import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScaledSheet } from "react-native-size-matters";
import { useMutation } from "react-query";

import { Box, Button, Image, ScreenBox, Text, TextInput } from "@/components";
import { useAuth } from "@/contexts/auth";
import { QueryKeys } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { FontName } from "@/theme";
import { Images } from "@assets/index";
import { resendSignupOtp, signIn } from "../services/api";
import { signInSchema } from "./schema";
import { SignInFormData } from "./types";

export const SigninScreen = () => {
  const auth = useAuth();
  const [sendingOtp, setSendingOtp] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const { isLoading: isSigningIn, mutate } = useMutation({
    mutationFn: signIn,
    mutationKey: QueryKeys.signIn,
    onError(error: any) {
      Toast.error(error.message);
    },
    onSuccess(data) {
      if (data?.data?.user && data?.data?.token) {
        const emailVerified = data.data.user.email_verified_status === "yes";
        if (emailVerified) {
          // ensure email is verified before loggin user in to home
          auth.signIn({
            profile: data?.data?.user,
            token: data?.data?.token,
          });
          Toast.success("Sign in successful");
        } else {
          // if email not verified, send OTP and push to email verification screen
          const email = data.data.user.email;
          setSendingOtp(true);
          resendSignupOtp(email)
            .then((_) => {
              Toast.info(
                "Please verify your email before signing in; this won't be required next time."
              );
              router.push({
                pathname: "/auth/signup/otp_verification/[email]",
                params: { email },
              });
            })
            .catch((_) => {
              logger.error("SigninScreen:: Failed to resend OTP");
              Toast.error(
                "Email verification OTP failed to send, please try again"
              );
            })
            .finally(() => setSendingOtp(false));
        }
      } else {
        logger.error(
          `SignInScreen:: Sign in successful but incorrect data returned from BE`,
          { data }
        );
        Toast.error("Sign in failed, please try again");
      }
    },
  });

  const handleSignIn = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <ScreenBox inkeyboardView inSafeArea={{ top: false }}>
      <Image source={Images.logo} style={styles.logo} contentFit="contain" />
      <Text
        variant={"heading"}
        style={{ fontSize: 32 }}
        mt={"s"}
        textAlign={"center"}
      >
        Login
      </Text>
      <Box
        borderWidth={2}
        borderColor={"text"}
        my={"s"}
        width={30}
        borderRadius={"round"}
        alignSelf={"center"}
      />
      <Text variant={"heading2"} color={"textMuted"} textAlign={"center"}>
        Welcome back, please login to continue
      </Text>

      <Box gap={"xxl"} pt={"xxl"}>
        <Box gap={"xs"}>
          <Text style={{ fontWeight: "black" }}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                autoFocus
                placeholder="Enter your email address"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />
        </Box>

        <Box gap={"xs"}>
          <Text>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                secureTextEntry
                returnKeyLabel="Sign In"
                onSubmitEditing={handleSignIn}
                autoCapitalize={"none"}
                placeholder="Enter your password"
                error={errors.password?.message}
              />
            )}
          />
        </Box>

        <Text
          textAlign={"center"}
          textDecorationLine={"underline"}
          color={"primary"}
          onPress={() => router.navigate("/auth/password/forgot")}
        >
          Forgot Password
        </Text>
        <Button
          label="Sign In"
          onPress={handleSignIn}
          loading={isSigningIn || sendingOtp}
        />
        <Text
          textAlign={"center"}
          onPress={() => router.navigate("/auth/signup")}
        >
          Don't have an account?{" "}
          <Text
            variant={"body"}
            color={"primary"}
            textDecorationLine={"underline"}
            style={{ fontFamily: FontName.PrimaryBold }}
            fontFamily={FontName.PrimaryBold}
          >
            Sign up
          </Text>
        </Text>
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
