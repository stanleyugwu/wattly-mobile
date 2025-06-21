import { createTheme } from "@shopify/restyle";
import { ScaledSize } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

import { FontName } from "./fonts";
import { palette } from "./palette";

export const theme = createTheme({
  colors: {
    primary: palette.blue,
    primaryText: palette.white,

    background: palette.gray05,
    surface: palette.white,
    overlay: palette.white400,

    text: palette.gray900,
    textSecondary: palette.gray700,
    textMuted: palette.gray700,
    border: palette.gray100,
    error: palette.red,
    success: palette.green,
    warning: palette.orange,
    shadow: palette.black100,

    white: palette.white,
    black: palette.black,
  },
  spacing: {
    none: 0,
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,
    l: 20,
    xl: 24,
    xxl: 32,
  },
  borderRadii: {
    none: 0,
    xs: 6,
    s: 10,
    m: 12,
    l: 16,
    xl: 20,
    round: 999,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },
  zIndices: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    tooltip: 700,
    default: 100,
  },
  boxVariant: {
    defaults: {},
    surface: {
      padding: {
        phone: "s",
        tablet: "m",
      },
      backgroundColor: "surface",
      borderRadius: {
        phone: "m",
        tablet: "m",
        desktop: "l",
      },
    },
    elevated: {
      padding: {
        phone: "s",
        tablet: "m",
      },
      backgroundColor: "surface",
      borderRadius: {
        phone: "m",
        tablet: "m",
        desktop: "l",
      },
      shadowColor: "shadow",
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
      elevation: 5,
    },
  },
  textVariants: {
    defaults: {
      fontSize: 16,
      color: "text",
      fontFamily: FontName.Primary,
      lineHeight: 24,
      fontWeight: "normal",
    },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      fontFamily: FontName.PrimaryBlack,
      color: "text",
      lineHeight: 36,
    },
    subheading: {
      fontSize: 22,
      fontFamily: FontName.PrimaryBold,
      color: "text",
      lineHeight: 30,
    },
    body: {
      fontSize: 16,
      color: "text",
      fontFamily: FontName.Primary,
      lineHeight: 24,
      fontWeight: "normal",
    },
    small: {
      fontSize: 14,
      color: "text",
      fontFamily: FontName.Primary,
      lineHeight: 22,
      fontWeight: "normal",
    },
    caption: {
      fontSize: 12,
      color: "textMuted",
      fontFamily: FontName.PrimaryLight,
      fontWeight: "normal",
      textTransform: "uppercase",
      lineHeight: 16,
    },
    buttonText: {
      fontSize: 16,
      color: "primaryText",
      fontFamily: FontName.PrimaryBold,
      fontWeight: "bold",
      textTransform: "uppercase",
      lineHeight: 20,
    },
  },

  palette: palette as typeof palette,
  layout: {
    screen: {} as ScaledSize,
  },
  // App insets
  insets: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  } as EdgeInsets,
  // All Global App Font typings
  fonts: FontName,
  isDarkMode: false,
});

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.darkCharcoal,
    surface: palette.black,
    overlay: palette.black400,
    text: palette.white,
    textSecondary: palette.gray300,
    textMuted: palette.gray300,
    shadow: palette.white50,
  },
  isDarkMode: true,
};

export type Theme = typeof theme;
