import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { QueryClientProvider } from "react-query";

import { BaseToast } from "@/components/ui";
import { queryClient } from "@/config/queryClient";
import { AuthProvider } from "@/contexts/auth";
import { OverlayLoaderProvider } from "@/contexts/overlay";
import { SettingsProvider } from "@/contexts/settings";
import { useLoadAssets } from "@/hooks";
import { AppThemeProvider } from "@/theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Host as PortalizeHost } from "react-native-portalize";

// add support for extended date formatting
dayjs.extend(advancedFormat);

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
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <SettingsProvider>
              <AppThemeProvider>
                <BottomSheetModalProvider>
                  <PortalizeHost>
                    <OverlayLoaderProvider>
                      <Stack>
                        <Stack.Screen
                          name="(protected)"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="auth"
                          options={{ headerShown: false }}
                        />
                      </Stack>
                    </OverlayLoaderProvider>
                    <BaseToast />
                  </PortalizeHost>
                </BottomSheetModalProvider>
              </AppThemeProvider>
            </SettingsProvider>
          </QueryClientProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
