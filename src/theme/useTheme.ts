import { useTheme as _useTheme } from "@shopify/restyle";
import { Theme } from "./theme";

export const useTheme = () => _useTheme<Theme>();
