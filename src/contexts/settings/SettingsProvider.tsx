import { useColorScheme } from "react-native";
import { PropsWithChildren, useEffect, useState } from "react";

import { SettingsContext } from "./context";
import { AppColorScheme, Settings } from "./types";
import { storageService } from "@/services";
import { STORE_KEYS } from "@/constants";
import { logger } from "@/lib/logger";

export const SettingsProvider = (props: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({
    themeMode: colorScheme || "light",
  });

  const setThemeHandler = (newTheme: AppColorScheme) => {
    const payload = {
      ...settings,
      themeMode: newTheme,
    };

    storageService.setItem(STORE_KEYS.SETTINGS, payload).then((saved) => {
      saved && logger.info("Settings: settings updated and saved");
    });
    setSettings(payload);
  };

  // Update the theme when the color scheme changes
  useEffect(() => {
    if (colorScheme) {
      setSettings((prev) => {
        const systemThemeModeSet = !prev.themeMode;
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
        const data = await storageService.getItem<Settings>(
          STORE_KEYS.SETTINGS
        );
        logger.info("Settings:: Settings loaded");
        if (data) setSettings(data);
      } catch (error) {
      } finally {
        setLoading(false);
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
