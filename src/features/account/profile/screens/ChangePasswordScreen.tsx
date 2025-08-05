import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { Box, Button, ScreenBox, Text, TextInput } from "@/components";
import { QueryKeys } from "@/lib/api";
import { Toast } from "@/lib/toast";
import { changePassword } from "../api";
import { changePasswordSchema } from "../schema";
import { ChangePasswordFormData } from "../types";

const passwordRules =
  "required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;";

/**
 * Screen component for changing password when logged in
 */
export const ChangePasswordScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { mutateAsync, isLoading: isChangingPassword } = useMutation({
    mutationFn: changePassword,
    mutationKey: QueryKeys.changePassword,
  });

  const handleChangePassword = handleSubmit(async (data) => {
    const { confirmPassword, password, oldPassword } = data;
    try {
      await mutateAsync({ password, oldPassword, confirmPassword });
      Toast.success("Password changed successfully");
    } catch (error: any) {
      Toast.error(error.message);
    }
  });

  return (
    <ScreenBox inkeyboardView inSafeArea={{ top: false }}>
      <Box gap={"xxl"} pt={"xxl"}>
        <Box gap={"xs"}>
          <Text>Old Password</Text>
          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                placeholder="Enter your old password"
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                passwordRules={passwordRules}
                error={errors.oldPassword?.message}
                returnKeyLabel="Next"
                returnKeyType="next"
                enterKeyHint="next"
              />
            )}
          />
        </Box>

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
          <Text>Confirm New Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                placeholder="Re-enter your new password"
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
          label="Update Changes"
          onPress={handleChangePassword}
          loading={isChangingPassword}
        />
        <Text
          textAlign={"center"}
          fontFamily={"PrimaryBold"}
          color={"primary"}
          textDecorationLine={"underline"}
          onPress={() => router.navigate("/auth/password/forgot")}
        >
          Don't remember your old password?
        </Text>
      </Box>
    </ScreenBox>
  );
};
