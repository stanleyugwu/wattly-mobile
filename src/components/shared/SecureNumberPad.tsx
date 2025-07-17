import { FC } from "react";
import { s } from "react-native-size-matters";

import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Box, Text } from "../ui";

// TODO: refactor code
export type Key = number | "del";

interface SecureNumberPadProps {
  onKeyPress: (key: Key) => void;
}

/**
 * Renders in-app numeric key input UI for secured entry
 */
export const SecureNumberPad: FC<SecureNumberPadProps> = ({ onKeyPress }) => {
  const keys: Array<(Key | null)[]> = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [null, 0, "del"],
  ];

  return (
    <Box gap={"m"} flex={1} alignSelf={"center"}>
      {keys.map((_, rowIndex) => {
        return (
          <Box
            key={`${rowIndex}`}
            flexDirection={"row"}
            style={{ columnGap: s(34) }}
          >
            {keys[rowIndex].map((key, index) => (
              <TouchableOpacity
                key={`${key}-${index}`}
                activeOpacity={0.3}
                onPress={() => {
                  if (key !== null) onKeyPress?.(key);
                }}
              >
                <Box
                  borderWidth={key !== null ? 1 : 0}
                  borderColor={"primary"}
                  borderRadius={"xs"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  p={"xl"}
                  px={key === "del" ? "none" : "xl"}
                  style={{ width: s(65) }}
                  maxWidth={s(100)}
                >
                  <Text fontFamily={"PrimaryBlack"}>
                    {key === "del" ? (
                      <Ionicons name="backspace-outline" size={s(24)} />
                    ) : (
                      key
                    )}
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};
