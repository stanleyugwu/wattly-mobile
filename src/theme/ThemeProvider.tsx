import { PropsWithChildren, useMemo } from "react";
import { ThemeProvider as RestyleThemeProvider } from "@shopify/restyle";
import {
  ThemeProvider as ReactNavigationThemeProvider,
  type Theme as ReactNavigationTheme,
} from "@react-navigation/native";

import { darkTheme, theme as lightTheme, Theme } from "./theme";
import { useSettings } from "@/contexts/settings";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";

/**
 * ThemeProvider component that provides the theme context
 * for the application by composing Restyle and React Navigation themes.
 *
 * NOTE: This component must be a child of the SettingsProvider
 * to access the current theme mode (light or dark).
 */
export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const {
    settings: { themeMode: colorScheme },
  } = useSettings();
  const insets = useSafeAreaInsets();
  const dimension = useWindowDimensions();

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const reactNavigationTheme: ReactNavigationTheme = useMemo(
    () => ({
      dark: colorScheme === "dark",
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.palette.red,
      },
      fonts: {
        bold: { fontFamily: theme.fonts.PrimaryBold, fontWeight: "bold" },
        regular: { fontFamily: theme.fonts.Primary, fontWeight: "normal" },
        heavy: { fontFamily: theme.fonts.PrimaryBlack, fontWeight: "bold" },
        medium: { fontFamily: theme.fonts.Primary, fontWeight: "500" },
      },
    }),
    [colorScheme]
  );

  const augmentedTheme: Theme = {
    ...theme,
    insets,
    layout: {
      screen: dimension,
    },
  };

  return (
    <RestyleThemeProvider theme={augmentedTheme}>
      <ReactNavigationThemeProvider value={reactNavigationTheme}>
        {children}
      </ReactNavigationThemeProvider>
    </RestyleThemeProvider>
  );
};
