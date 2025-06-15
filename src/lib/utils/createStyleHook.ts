import { useMemo } from "react";
import { NamedStyles, ScaledSheet, Size } from "react-native-size-matters";

import { Theme, useTheme } from "@/theme";
import { RegisteredStyle } from "react-native";

type FnParam<T> = (theme: Theme) => T;
type Return<T> = () => Theme & {
  styles: {
    [P in keyof T]: RegisteredStyle<{
      [S in keyof T[P]]: T[P][S] extends Size ? number : T[P][S];
    }>;
  };
};

/**
 * Higher-order factory function for using theme-supported styles defined
 * outside a component, within the component as a hook
 */
export const createStyleHook = <T extends NamedStyles<T> | NamedStyles<any>>(
  styleFn: FnParam<T>
): Return<T> => {
  return () => {
    const theme = useTheme();
    const styles = useMemo(() => {
      return ScaledSheet.create(styleFn(theme));
    }, [theme]);

    return {
      ...theme,
      styles,
    };
  };
};
