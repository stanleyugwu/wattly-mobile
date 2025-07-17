import BSheet, { BottomSheetProps as BaseBsPropps } from "@gorhom/bottom-sheet";
import { ListRenderItem } from "react-native";
import { SharedValue } from "react-native-reanimated";

/**
 * Bottom sheet props
 */
export interface BottomSheetProps extends BaseBsPropps {}

/**
 * Bottom sheet ref methods
 */
export type BottomSheetRef = BSheet;

/**
 * Custom sheet component with Ref property support
 */
export interface BottomSheet
  extends React.ForwardRefExoticComponent<
    React.PropsWithoutRef<BottomSheetProps> &
      React.RefAttributes<BottomSheetRef>
  > {
  Ref: BottomSheetRef;
}

export type BSheetFlatListRenderItem<Data = null> =
  | ListRenderItem<Data>
  | SharedValue<ListRenderItem<Data> | null | undefined>
  | null
  | undefined;
