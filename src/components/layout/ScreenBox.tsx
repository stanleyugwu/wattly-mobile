import { FC, PropsWithChildren, useMemo } from "react";
import { Insets, ScrollView, ScrollViewProps } from "react-native";

import { useTheme } from "@/theme";
import { Box, BoxProps } from "../ui";
import { KeyboardAwareBox } from "./KeyboardAwareBox";

interface ScreenBoxProps extends BoxProps {
  /**
   * Determines whther screen is rendered inside safe area
   * insets to avoid colliding with device notches.
   *
   * An object can be passed to selectively apply inset to either top or bottom
   */
  inSafeArea?: boolean | { [K in keyof Insets]?: boolean };
  scrollViewProps?: ScrollViewProps;

  /**
   * If true, wraps children inside keyboard avoinding view
   */
  inkeyboardView?: boolean;
}

export const ScreenBox: FC<PropsWithChildren<ScreenBoxProps>> = ({
  inSafeArea = true,
  children,
  scrollViewProps,
  style,
  inkeyboardView = false,
  ...rest
}) => {
  const { insets, spacing } = useTheme();

  // calculation to allow enabling inset for only top or bottom of screen
  const finalInset = useMemo(() => {
    let finalInset: Insets = insets;
    if (typeof inSafeArea == "boolean") {
      finalInset = {
        top: inSafeArea ? insets.top + spacing.m : spacing.m,
        bottom: inSafeArea ? insets.bottom + spacing.m : spacing.m,
        left: inSafeArea ? insets.left + spacing.m : spacing.m,
        right: inSafeArea ? insets.right + spacing.m : spacing.m,
      };
    } else if (inSafeArea instanceof Object) {
      finalInset = {
        top: inSafeArea.top === false ? spacing.m : insets.top + spacing.m,
        bottom:
          inSafeArea.bottom === false ? spacing.m : insets.bottom + spacing.m,
        left: inSafeArea.left === false ? spacing.m : insets.left + spacing.m,
        right:
          inSafeArea.right === false ? spacing.m : insets.right + spacing.m,
      };
    }
    return finalInset;
  }, [insets, inSafeArea]);

  const Wrapper = inkeyboardView ? KeyboardAwareBox : Box;

  return (
    <Wrapper>
      <ScrollView {...scrollViewProps} showsVerticalScrollIndicator={false}>
        <Box
          p={{ phone: "m" }}
          style={[
            {
              paddingTop: finalInset.top,
              paddingBottom: finalInset.bottom,
              paddingLeft: finalInset.left,
              paddingRight: finalInset.right,
            },
            style,
          ]}
          {...rest}
        >
          {children}
        </Box>
      </ScrollView>
    </Wrapper>
  );
};

ScreenBox.displayName = "ScreenBox";
