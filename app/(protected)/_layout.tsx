import { useAuthContext } from "@/contexts/auth";
import { Redirect, Stack } from "expo-router";

export default function ProtectedLayout() {
  const auth = useAuthContext();

  if (!auth.isSignedIn) {
    // Redirect to login if not authenticated
    return <Redirect href="/auth/signup" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
