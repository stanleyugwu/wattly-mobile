import { Box, Image, Text } from "@/components";
import { createStyleHook } from "@/lib/utils";
import { FC } from "react";
import { s } from "react-native-size-matters";
import { IReferredUser } from "../types";

interface ReferredUserProps {
  user: IReferredUser;
}

/**
 * Renders a referred user
 */
export const ReferredUser: FC<ReferredUserProps> = ({ user }) => {
  const { styles } = useStyles();
  return (
    <Box flexDirection={"row"} alignItems={"center"} cg={"xs"}>
      <Image
        source={{ uri: user.profile, width: s(40), height: s(40) }}
        style={styles.profileImg}
      />
      <Box rg={"xxs"}>
        <Text fontFamily={"PrimaryBold"}>{user.name}</Text>
        <Text>{user.email}</Text>
      </Box>
    </Box>
  );
};

const useStyles = createStyleHook(({ borderRadii, colors }) => ({
  profileImg: {
    width: "45@s",
    height: "45@s",
    backgroundColor: colors.background,
    borderRadius: borderRadii.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
}));
