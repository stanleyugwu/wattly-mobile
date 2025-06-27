import { FC, Fragment, PropsWithChildren } from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box, BoxProps } from "../ui";

interface ScreenBoxProps extends BoxProps {
  inSafeArea?: boolean;
  scrollViewProps?: ScrollViewProps;
}

export const ScreenBox: FC<PropsWithChildren<ScreenBoxProps>> = ({
  inSafeArea = true,
  children,
  scrollViewProps,
  ...rest
}) => {
  const Wrapper = inSafeArea ? SafeAreaView : Fragment;
  return (
    <Wrapper>
      <ScrollView showsVerticalScrollIndicator={false} {...scrollViewProps}>
        <Box p={{ phone: "m" }} {...rest}>
          {children}
        </Box>
      </ScrollView>
    </Wrapper>
  );
};
