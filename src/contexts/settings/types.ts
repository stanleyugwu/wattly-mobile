export type AppColorScheme = "light" | "dark" | null;

export type SettingsContextType = {
  settings: {
    themeMode: AppColorScheme;
  };
  setTheme: (theme: AppColorScheme) => void;
};

export type Settings = SettingsContextType["settings"];
