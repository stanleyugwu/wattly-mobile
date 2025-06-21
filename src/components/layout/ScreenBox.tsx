import { FC, Fragment, PropsWithChildren } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box, BoxProps } from "../ui";

interface ScreenBoxProps extends BoxProps {
  inSafeArea?: boolean;
}

export const ScreenBox: FC<PropsWithChildren<ScreenBoxProps>> = ({
  inSafeArea = true,
  children,
  ...rest
}) => {
  const Wrapper = inSafeArea ? SafeAreaView : Fragment;
  return (
    <Wrapper>
      <ScrollView>
        <Box p={{ phone: "m" }} {...rest}>
          {children}
        </Box>
      </ScrollView>
    </Wrapper>
  );
};
