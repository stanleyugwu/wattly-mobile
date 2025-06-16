import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "signin",
};

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="signin"
      screenOptions={{
        headerStyle: { backgroundColor: "transparent" },
        headerShadowVisible: false,
        headerTitle: "",
        animation: "ios_from_right",
      }}
    >
      {/* This is the layout for the auth screens */}
      <Stack.Screen name="signin" />

      <Stack.Screen name="signup" />
      <Stack.Screen name="signup/otp_verification/[email]" />
      <Stack.Screen name="signup/otp_verified" />

      <Stack.Screen name="password/forgot" />
      <Stack.Screen name="password/forgot/otp_verification/[email]" />

      <Stack.Screen name="password/reset/[email]" />
      <Stack.Screen name="password/reset/reset_successful" />
    </Stack>
  );
}
