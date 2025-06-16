import {
  createRestyleComponent,
  createText,
  createVariant,
  VariantProps,
} from "@shopify/restyle";
import { FC } from "react";

import { Theme, useTheme } from "@/theme";

type TextProps = VariantProps<Theme, "textVariants"> &
  React.ComponentProps<typeof TextBase>;

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

  return (
    <ThemedText
      {...props}
      adjustsFontSizeToFit={false}
      allowFontScaling={false}
      style={
        props.color
          ? [
              props.style,
              { color: theme.colors[props.color as keyof Theme["colors"]] },
            ]
          : props.style
      }
    />
  );
};
