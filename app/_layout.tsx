import "react-native-reanimated";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { QueryClientProvider } from "react-query";

import { useLoadAssets } from "@/hooks";
import { AuthProvider } from "@/contexts/auth";
import { SettingsProvider } from "@/contexts/settings";
import { AppThemeProvider } from "@/theme";
import { queryClient } from "@/config/queryClient";
import { BaseToast } from "@/components/ui";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(protected)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// The SplashScreen will be hidden after loading auth data in AuthProvider.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded } = useLoadAssets();
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <AppThemeProvider>
              <Stack>
                <Stack.Screen
                  name="(protected)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
              </Stack>
              <BaseToast />
            </AppThemeProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
