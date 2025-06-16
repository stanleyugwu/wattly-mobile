import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/contexts/auth";

export default function ProtectedLayout() {
  const auth = useAuth();

  if (!auth.isSignedIn) {
    // Redirect to login if not authenticated
    return <Redirect href="/auth/signin" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
