import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <>
      {/* This is the layout for the auth screens */}
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="password/forgot" options={{ headerShown: false }} />
      <Stack.Screen name="password/reset" options={{ headerShown: false }} />
    </>
  );
}
