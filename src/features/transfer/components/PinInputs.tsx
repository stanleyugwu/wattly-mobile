import { Box, Text } from "@/components";
import { FC, memo } from "react";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { s, vs } from "react-native-size-matters";

interface PinInputsProps {
  value: string;
  error?: boolean;
}

interface PinInputCellProps {
  index: number;
  char?: string;
  error?: boolean;
}

const PinInputCell: FC<PinInputCellProps> = memo(({ index, char, error }) => {
  return (
    <Box
      key={index}
      borderWidth={1}
      borderColor={error ? "error" : "border"}
      borderRadius="xs"
      p="s"
      width={s(45)}
      height={s(45)}
      justifyContent="center"
      alignItems="center"
    >
      {char ? (
        <Text
          variant="heading"
          style={{ lineHeight: vs(30) }}
          textAlign="center"
          fontFamily="PrimaryBlack"
        >
          *
        </Text>
      ) : null}
    </Box>
  );
});

export const PinInputs: FC<PinInputsProps> = ({ value, error }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: error
          ? withRepeat(withTiming(10, { duration: 100 }), 4, true)
          : 0,
      },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Box flexDirection="row" cg="m">
        {[0, 1, 2, 3].map((index) => (
          <PinInputCell
            key={index}
            index={index}
            char={value[index]}
            error={error}
          />
        ))}
      </Box>
    </Animated.View>
  );
};
