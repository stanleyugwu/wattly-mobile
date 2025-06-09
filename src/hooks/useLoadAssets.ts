import { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";

import { FontName } from "@/theme";

export const useLoadAssets = () => {
  const [loaded, error] = useFonts({
    [FontName.SpaceMono]: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    [FontName.Primary]: require("../../assets/fonts/Lato/Lato-Regular.ttf"),
    [FontName.PrimaryItalic]: require("../../assets/fonts/Lato/Lato-Italic.ttf"),

    [FontName.PrimaryBold]: require("../../assets/fonts/Lato/Lato-Bold.ttf"),
    [FontName.PrimaryBoldItalic]: require("../../assets/fonts/Lato/Lato-BoldItalic.ttf"),

    [FontName.PrimaryLight]: require("../../assets/fonts/Lato/Lato-Light.ttf"),
    [FontName.PrimaryLightItalic]: require("../../assets/fonts/Lato/Lato-LightItalic.ttf"),

    [FontName.PrimaryBlack]: require("../../assets/fonts/Lato/Lato-Black.ttf"),
    [FontName.PrimaryBlackItalic]: require("../../assets/fonts/Lato/Lato-BlackItalic.ttf"),

    [FontName.PrimaryThin]: require("../../assets/fonts/Lato/Lato-Thin.ttf"),
    [FontName.PrimaryThinItalic]: require("../../assets/fonts/Lato/Lato-ThinItalic.ttf"),

    ...FontAwesome.font,
  });

  // TODO: add image caching and prefetching logic here

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return {
    loaded,
    error,
  };
};
