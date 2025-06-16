import { createBox, BoxProps as BaseBoxProps } from "@shopify/restyle";

import { Theme } from "@/theme";

export type BoxProps = BaseBoxProps<Theme, true>;
export const Box = createBox<Theme>();
