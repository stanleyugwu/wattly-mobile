import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { useMutation } from "react-query";

import { Box, Button, Image, ScreenBox, Text, TextInput } from "@/components";
import { QueryKeys } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { FontName } from "@/theme";
import { Images } from "@assets/index";
import { signUp } from "../services/api";
import { signUpSchema } from "./schema";
import { SignUpFormData } from "./types";

const passwordRules =
  "required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;";

export const SignupScreen = () => {
  const { ref: referralCode } = useLocalSearchParams<{ ref: string }>();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    shouldUseNativeValidation: true,
    shouldFocusError: true,
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: signUp,
    mutationKey: QueryKeys.signUp,
    onError(error: any) {
      logger.error("Failed to sign up", { error });
      Toast.error(error.message);
    },
    onSuccess(data) {
      const email = getValues("email");
      router.replace({
        pathname: "/auth/signup/otp_verification/[email]",
        params: { email },
      });
    },
  });

  const handleSignup = handleSubmit((data) => {
    mutate(data);
  });

  useEffect(() => {
    if (referralCode?.trim()) {
      setValue("referralCode", referralCode.trim());
      Toast.success("Referral code applied");
    }
  }, [referralCode]);

  return (
    <KeyboardAvoidingView behavior="height">
      <ScreenBox>
        <Image source={Images.logo} style={styles.logo} contentFit="contain" />
        <Text
          variant={"heading"}
          style={{ fontSize: 32 }}
          mt={"s"}
          textAlign={"center"}
        >
          Create your own{"\n"}account
        </Text>
        <Box
          borderWidth={2}
          borderColor={"text"}
          my={"s"}
          width={50}
          borderRadius={"round"}
          alignSelf={"center"}
        />
        <Text variant={"heading2"} color={"textMuted"} textAlign={"center"}>
          Setup your account to get started
        </Text>

        <Box gap={"xxl"} pt={"xxl"}>
          <Box gap={"xs"}>
            <Text style={{ fontWeight: "black" }}>Full Name</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  autoFocus
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.fullName?.message}
                  returnKeyLabel="Next"
                  returnKeyType="next"
                  enterKeyHint="next"
                />
              )}
            />
          </Box>

          <Box gap={"xs"}>
            <Text style={{ fontWeight: "black" }}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  onBlur={onBlur}
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                  returnKeyLabel="Next"
                  returnKeyType="next"
                  enterKeyHint="next"
                />
              )}
            />
          </Box>

          <Box gap={"xs"}>
            <Text style={{ fontWeight: "black" }}>Phone Number</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  autoComplete="tel"
                  error={errors.phone?.message}
                  returnKeyLabel="Next"
                  returnKeyType="next"
                  enterKeyHint="next"
                />
              )}
            />
          </Box>

          <Box gap={"xs"}>
            <Text>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Enter a password"
                  secureTextEntry
                  importantForAutofill="yes"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  passwordRules={passwordRules}
                  error={errors.password?.message}
                  returnKeyLabel="Next"
                  returnKeyType="next"
                  enterKeyHint="next"
                />
              )}
            />
          </Box>

          <Box gap={"xs"}>
            <Text>Confirm Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Re-enter your password"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  passwordRules={passwordRules}
                  error={errors.confirmPassword?.message}
                  submitBehavior="blurAndSubmit"
                  returnKeyLabel="Done"
                  returnKeyType="done"
                  enterKeyHint="done"
                />
              )}
            />
          </Box>

          <Box gap={"xs"}>
            <Text>Referrer Code (If someone referred you)</Text>
            <Controller
              control={control}
              name="referralCode"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  placeholder="Enter referral code"
                  onChangeText={onChange}
                  autoCapitalize="none"
                  maxLength={11}
                  onBlur={onBlur}
                  value={value}
                  error={errors.referralCode?.message}
                  returnKeyLabel="Done"
                  returnKeyType="done"
                  enterKeyHint="done"
                />
              )}
            />
          </Box>

          <Text
            textAlign={"center"}
            onPress={() => router.push("/auth/signin")}
          >
            Already have an account?{" "}
            <Text
              variant={"body"}
              color={"primary"}
              textDecorationLine={"underline"}
              style={{ fontFamily: FontName.PrimaryBold }}
              fontFamily={FontName.PrimaryBold}
            >
              Sign in
            </Text>
          </Text>

          <Button
            label="Create account"
            loading={isLoading}
            onPress={handleSignup}
          />
          <Text textAlign={"center"} mb={"l"}>
            By continuing, you agree to our{"\n"}
            <Text
              color={"primary"}
              onPress={() => router.push("/terms_and_condition")}
            >
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text
              color={"primary"}
              onPress={() => router.push("/privacy_policy")}
            >
              Privacy Policy
            </Text>
          </Text>
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
