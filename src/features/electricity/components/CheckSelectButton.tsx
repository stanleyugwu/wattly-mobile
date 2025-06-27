import { FC } from "react";
import { Pressable } from "react-native";

import { Box, Text } from "@/components";
import { createStyleHook } from "@/lib/utils";
import { AntDesign } from "@expo/vector-icons";
import { s } from "react-native-size-matters";

interface CheckSelectButtonProps {
  label: string;
  selected: boolean;
  onPress: VoidFunction;
}

/**
 * Renders a selectible button with label and checkmark
 */
export const CheckSelectButton: FC<CheckSelectButtonProps> = ({
  label,
  selected,
  onPress,
}) => {
  const { palette, colors, styles } = useStyles();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Box
        style={{
          backgroundColor: selected ? palette.blue100 : colors.transparent,
        }}
        borderRadius={"xs"}
        borderWidth={1}
        borderColor={selected ? "primary" : "textMuted"}
        px={"xxl"}
        py={"s"}
      >
        <Text
          variant={"caption"}
          color={selected ? "primary" : "textMuted"}
          fontFamily={"PrimaryBold"}
        >
          {label}
        </Text>
        {selected ? (
          <Box
            bg={"primary"}
            position={"absolute"}
            overflow={"hidden"}
            right={s(-17)}
            bottom={s(-17)}
            width={s(35)}
            alignItems={"center"}
            justifyContent={"flex-start"}
            height={s(35)}
            style={{
              transform: [{ rotate: "-45deg" }],
              paddingTop: s(1),
            }}
          >
            <Box
              style={{
                transform: [{ rotate: "50deg" }],
              }}
            >
              <AntDesign name="check" size={s(13)} color={palette.white} />
            </Box>
          </Box>
        ) : null}
      </Box>
    </Pressable>
  );
};

const useStyles = createStyleHook(() => ({
  container: { minWidth: "100@s", overflow: "hidden" },
}));
