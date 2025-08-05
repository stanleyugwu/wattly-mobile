import BSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";

import { createStyleHook } from "@/lib/utils";
import { Keyboard } from "react-native";
import { Portal } from "react-native-portalize";
import {
  BottomSheetProps,
  BottomSheetRef,
  BottomSheet as SheetInterface,
} from "./types";

/**
 * Renders app-themed, pre-styled bottom sheet component
 */
const BottomSheetComponent = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ style, handleIndicatorStyle, backgroundStyle, ...rest }, ref) => {
    const { colors, styles } = useStyles();

    return (
      <Portal>
        <BSheet
          onClose={Keyboard.dismiss}
          handleIndicatorStyle={[
            handleIndicatorStyle,
            { backgroundColor: colors.text },
          ]}
          backdropComponent={(props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          )}
          snapPoints={["50%"]}
          style={[styles.providerSheetStyle, style]}
          index={-1}
          backgroundStyle={[
            backgroundStyle,
            { backgroundColor: colors.surface },
          ]}
          ref={ref}
          {...rest}
        />
      </Portal>
    );
  }
);

// Add Ref property type for easy use in parent useRef type
// We juyst add the type not the actual Ref property
const BottomSheet = BottomSheetComponent as SheetInterface;

const useStyles = createStyleHook(
  ({ spacing, colors, isDarkMode, borderRadii }) => ({
    providerSheetStyle: {
      padding: spacing.m,
      backgroundColor: colors.surface,
      borderTopLeftRadius: borderRadii.xl,
      borderTopRightRadius: borderRadii.xl,
      shadowColor: isDarkMode ? colors.white : colors.black,
      shadowOffset: { height: 1, width: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
  })
);

export { BottomSheet };
