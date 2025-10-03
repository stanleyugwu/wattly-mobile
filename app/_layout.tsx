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
import { AuthProvider } from "@/contexts/auth";
import { OverlayLoaderProvider } from "@/contexts/overlay_loader";
import { SettingsProvider } from "@/contexts/settings";
import { OverlaySuccessProvider } from "@/contexts/success_overlay";
import { useLoadAssets } from "@/hooks";
import { queryClient } from "@/lib/api";
import { globalErrorHandler } from "@/lib/utils";
import { AppThemeProvider } from "@/theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Sentry from "@sentry/react-native";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Host as PortalizeHost } from "react-native-portalize";

Sentry.init({
  dsn: "https://8b5579f8b501ca50930e23ea75e8a21d@o4509767713423360.ingest.us.sentry.io/4510126670544896",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  // @ts-ignore
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// add support for extended date formatting
dayjs.extend(advancedFormat);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Global error handler
ErrorUtils.setGlobalHandler(globalErrorHandler);

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(protected)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// The SplashScreen will be hidden after loading auth data in AuthProvider.
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const { loaded } = useLoadAssets();
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
});

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
                    <OverlaySuccessProvider>
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
                          <Stack.Screen
                            name="privacy_policy"
                            options={{
                              headerTitle: "Privacy Policy",
                              headerBackTitle: "Back",
                            }}
                          />
                          <Stack.Screen
                            name="terms_and_condition"
                            options={{
                              headerTitle: "Terms and Conditions",
                              headerBackTitle: "Back",
                            }}
                          />
                        </Stack>
                      </OverlayLoaderProvider>
                    </OverlaySuccessProvider>
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
