import {
  createBox,
  createRestyleComponent,
  createVariant,
  VariantProps,
} from "@shopify/restyle";

import { Theme } from "@/theme";

export type BoxProps = VariantProps<Theme, "boxVariant"> &
  React.ComponentProps<typeof ThemedBox>;

export const ThemedBox = createBox<Theme>();

export const Box = createRestyleComponent<BoxProps, Theme>(
  [createVariant({ themeKey: "boxVariant" })],
  ThemedBox
);
