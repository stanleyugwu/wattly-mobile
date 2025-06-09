import { createTheme } from "@shopify/restyle";

import { palette } from "./palette";
import { FontName } from "./fonts";
import { Dimensions, ScaledSize } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

export const theme = createTheme({
  colors: {
    primary: palette.blue,
    primaryText: palette.white,

    background: palette.gray100,
    surface: palette.white,
    overlay: palette.white400,

    text: palette.gray900,
    textSecondary: palette.gray700,
    textMuted: palette.gray300,

    border: palette.gray100,
    error: palette.red,
    success: palette.green,
    warning: palette.orange,

    white: palette.white,
    black: palette.black,
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    s: 6,
    m: 8,
    l: 10,
    xl: 12,
    xxl: 20,
  },
  borderRadii: {
    none: 0,
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
  surfaceVariants: {
    defaults: {},
    regular: {
      padding: {
        phone: "s",
        tablet: "m",
      },
      backgroundColor: "surface",
      borderRadius: {
        phone: "s",
        tablet: "m",
      },
    },
    elevated: {
      padding: {
        phone: "s",
        tablet: "m",
      },
      backgroundColor: "surface",
      borderRadius: {
        phone: "s",
        tablet: "m",
      },
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 15,
      elevation: 5,
    },
  },
  textVariants: {
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      fontFamily: FontName.PrimaryBlack,
      color: "text",
      lineHeight: 32,
    },
    subheading: {
      fontSize: 20,
      fontFamily: FontName.PrimaryBold,
      color: "text",
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      color: "text",
      fontFamily: FontName.Primary,
      lineHeight: 24,
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
    background: palette.gray900,
    surface: palette.gray700,
    overlay: palette.black400,
    text: palette.white,
    textSecondary: palette.gray300,
    textMuted: palette.gray100,
  },
  isDarkMode: true,
};

export type Theme = typeof theme;
