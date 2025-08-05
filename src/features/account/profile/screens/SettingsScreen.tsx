import React, { type FC } from "react";
import { s } from "react-native-size-matters";

import { Box, ScreenBox, Text, TextProps } from "@/components";
import { useTheme } from "@/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

interface MenuButtonProps {
  label: string;
  onPress: VoidFunction;
  labelColor?: TextProps["color"];
  icon: keyof (typeof AntDesign)["glyphMap"];
}

const MenuButton: FC<MenuButtonProps> = ({
  icon,
  label,
  onPress,
  labelColor = "text",
}) => {
  const { palette, colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box
        flexDirection={"row"}
        alignItems={"center"}
        cg={"s"}
        p={"m"}
        borderRadius={"s"}
        bg={"background"}
        justifyContent={"space-between"}
      >
        <Box flexDirection={"row"} alignItems={"center"} cg={"s"}>
          <Box bg={"primary"} borderRadius={"round"} p={"xs"}>
            <AntDesign name={icon} size={s(14)} color={palette.white} />
          </Box>
          <Text color={labelColor}>{label}</Text>
        </Box>
        <Ionicons
          name="chevron-forward"
          size={s(14)}
          color={colors[(labelColor as keyof typeof colors) || "text"]}
        />
      </Box>
    </TouchableOpacity>
  );
};

interface SettingsScreenProps {}

/**
 * Component for `Settings` screen
 */
export const SettingsScreen: FC<SettingsScreenProps> = (props) => {
  return (
    <ScreenBox inSafeArea={{ top: false }}>
      <Text fontFamily={"PrimaryBold"}>Security</Text>
      <Box variant={"surface"} rg={"l"} mt={"xs"} mb={"xl"}>
        <MenuButton
          icon="lock"
          label="Change Password"
          onPress={() =>
            router.navigate("/(protected)/(tabs)/account/change_password")
          }
        />
        <MenuButton
          icon="key"
          label="Change Transaction Pin"
          onPress={() => router.navigate("/(protected)/transfer/pin/change")}
        />
      </Box>

      <Text fontFamily={"PrimaryBold"}>About</Text>
      <Box variant={"surface"} rg={"l"} mt={"xs"} mb={"xl"}>
        <MenuButton
          icon="filetext1"
          label="About"
          onPress={() => router.navigate("/(protected)/(tabs)/account/about")}
        />
      </Box>

      <Text fontFamily={"PrimaryBold"}>Account</Text>
      <Box variant={"surface"} rg={"l"} mt={"xs"}>
        <MenuButton
          icon="deleteuser"
          label="Delete Account"
          labelColor={"error"}
          onPress={() =>
            router.navigate("/(protected)/(tabs)/account/delete_account")
          }
        />
      </Box>
    </ScreenBox>
  );
};

SettingsScreen.displayName = "SettingsScreen";
