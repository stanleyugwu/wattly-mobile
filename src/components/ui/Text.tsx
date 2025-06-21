import {
  createRestyleComponent,
  createText,
  createVariant,
  ResponsiveValue,
  useResponsiveProp,
  VariantProps,
} from "@shopify/restyle";
import { FC } from "react";

import { Font, Theme, useTheme } from "@/theme";

type TextProps = VariantProps<Theme, "textVariants"> &
  React.ComponentProps<typeof TextBase> & {
    fontFamily?: ResponsiveValue<Font, Theme["breakpoints"]>;
  };

const TextBase = createText<Theme>();

export const ThemedText = createRestyleComponent<TextProps, Theme>(
  [createVariant({ themeKey: "textVariants" })],
  TextBase
);

/**
 * App-wide Text component with support for variants, automatic theme adoption and `color` override
 * (i.e when you pass `variant` and `color` props, `color` would override the `color` defined in the given `variant`)
 */
export const Text: FC<TextProps> = (props) => {
  const theme = useTheme();
  const color = useResponsiveProp(props.color);
  const fontFamily = useResponsiveProp(props.fontFamily);

  return (
    <ThemedText
      {...props}
      adjustsFontSizeToFit={false}
      allowFontScaling={false}
      style={[
        props.style,
        color && {
          color: theme.colors[color as keyof Theme["colors"]],
        },
        fontFamily && {
          fontFamily: theme.fonts[fontFamily as keyof Theme["fonts"]],
        },
      ]}
    />
  );
};
