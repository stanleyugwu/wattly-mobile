import { useColorScheme } from "react-native";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import { SettingsContext } from "./context";
import { AppColorScheme, Settings } from "./types";
import { storageService } from "@/services";
import { STORE_KEYS } from "@/constants";
import { logger } from "@/lib/logger";

/**
 * App-wide settings context provider
 * NOTE: Also handles manually hiding the splash screen after auth data is loaded
 */
export const SettingsProvider = (props: PropsWithChildren<{}>) => {
  const persistedThemeMode = useRef<AppColorScheme>(null);

  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({
    themeMode: null,
  });

  const setThemeHandler = (newTheme: AppColorScheme) => {
    const payload = {
      ...settings,
      themeMode: newTheme,
    };
    storageService.setItem(STORE_KEYS.SETTINGS, payload).then((saved) => {
      if (saved) {
        persistedThemeMode.current = newTheme;
        logger.info("Settings: settings updated and saved");
      }
    });
    setSettings(payload);
  };

  // Update the theme when the color scheme changes
  useEffect(() => {
    if (colorScheme) {
      setSettings((prev) => {
        // when null, then theme is set to 'system'
        const systemThemeModeSet = !persistedThemeMode.current;
        if (systemThemeModeSet)
          return {
            ...prev,
            themeMode: colorScheme,
          };
        return prev;
      });
    }
  }, [colorScheme]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await storageService.getItem<Settings>(
          STORE_KEYS.SETTINGS
        );

        logger.info(`Settings:: Settings loaded: ${settings}`);

        if (settings) {
          persistedThemeMode.current = settings.themeMode;
          setSettings(settings);
        }
      } catch (error) {
      } finally {
        setLoading(false);
        SplashScreen.hideAsync().catch((error) => {
          logger.error(`SplashScreen:: Error hiding splash screen: ${error}`);
        });
      }
    };
    loadSettings();
  }, []);

  if (loading) return null;

  return (
    <SettingsContext.Provider value={{ settings, setTheme: setThemeHandler }}>
      {props.children}
    </SettingsContext.Provider>
  );
};
