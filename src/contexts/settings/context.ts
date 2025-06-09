import { createContext } from "react";
import { SettingsContextType } from "./types";

export const SettingsContext = createContext<SettingsContextType>({
  settings: {
    themeMode: "light",
  },
  setTheme: () => {},
});
