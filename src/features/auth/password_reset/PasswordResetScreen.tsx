import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScaledSheet } from "react-native-size-matters";
import { useMutation } from "react-query";

import { Box, Button, Image, ScreenBox, Text, TextInput } from "@/components";
import { QueryKeys } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { Images } from "@assets/index";
import { resetPassword } from "../services/api";
import { passwordResetSchema } from "./schema";
import { PasswordResetFormData } from "./types";

const passwordRules =
  "required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;";

export const PasswordResetScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { mutate, isLoading: isResettingPassword } = useMutation({
    mutationFn: resetPassword,
    mutationKey: QueryKeys.resetPassword,
    onSuccess(data) {
      router.dismissTo("/auth/password/reset/reset_successful");
    },
    onError(error: any) {
      logger.error("Password reset failed", { error });
      Toast.error(error.message);
    },
  });

  const handleChangePassword = handleSubmit((data) => {
    const { confirmPassword, password } = data;
    if (!email)
      logger.error(
        "PasswordResetScreen:: Email wasn't passed via query params"
      );

    mutate({ email: email, password, password_confirmation: confirmPassword });
  });

  return (
    <ScreenBox inkeyboardView>
      <Image source={Images.logo} style={styles.logo} contentFit="contain" />
      <Text
        variant={"heading"}
        style={{ fontSize: 32 }}
        mt={"s"}
        textAlign={"center"}
      >
        Create a new{"\n"}password
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
        All good! Now setup a new strong password for your account
      </Text>

      <Box gap={"xxl"} pt={"xxl"}>
        <Box gap={"xs"}>
          <Text>New Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                placeholder="Enter a new password"
                secureTextEntry
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

        <Box gap={"xs"} mb={"xxl"}>
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
        <Button
          label="Reset Password"
          onPress={handleChangePassword}
          loading={isResettingPassword}
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
