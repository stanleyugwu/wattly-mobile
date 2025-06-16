import { FC, PropsWithChildren } from "react";
import { ScrollView } from "react-native";

import { Box, BoxProps } from "../ui";

export const ScreenBox: FC<PropsWithChildren<BoxProps>> = ({
  children,
  ...rest
}) => {
  return (
    <ScrollView>
      <Box p={{ phone: "m" }} {...rest}>
        {children}
      </Box>
    </ScrollView>
  );
};
