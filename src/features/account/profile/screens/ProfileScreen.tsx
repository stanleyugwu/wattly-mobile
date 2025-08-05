import React, { type FC } from "react";
import { s } from "react-native-size-matters";

import { Box, Image, ScreenBox, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { PROFILE_PIC_BASE_URL } from "@/lib/constants";
import { createStyleHook } from "@/lib/utils";
import { useTheme } from "@/theme";
import { Images } from "@assets/index";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { Alert, TouchableOpacity } from "react-native";

interface MenuButtonProps {
  label: string;
  onPress: VoidFunction;
  icon: keyof (typeof AntDesign)["glyphMap"];
}

const MenuButton: FC<MenuButtonProps> = ({ icon, label, onPress }) => {
  const { palette, colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box
        flexDirection={"row"}
        alignItems={"center"}
        cg={"s"}
        p={"xs"}
        justifyContent={"space-between"}
      >
        <Box flexDirection={"row"} alignItems={"center"} cg={"s"}>
          <Box bg={"primary"} borderRadius={"round"} p={"xs"}>
            <AntDesign name={icon} size={s(14)} color={palette.white} />
          </Box>
          <Text>{label}</Text>
        </Box>
        <Ionicons name="chevron-forward" size={s(14)} color={colors.text} />
      </Box>
    </TouchableOpacity>
  );
};

interface ProfileScreenProps {}

/**
 * Component for `ProfileScreen` screen
 */
export const ProfileScreen: FC<ProfileScreenProps> = (props) => {
  const { styles, palette } = useStyles();
  const { user, signOut } = useAuth();

  const navigate = (path: Href) => () => router.navigate(path);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Log out", style: "destructive", onPress: signOut },
      { text: "Stay back", isPreferred: true, style: "default" },
    ]);
  };

  const profilePicUrl = `${PROFILE_PIC_BASE_URL}/${user?.profile.profile}`;

  return (
    <ScreenBox rg={"xxl"}>
      <Box alignItems={"center"} justifyContent={"center"} rg={"xs"}>
        <Image
          source={profilePicUrl}
          contentFit="contain"
          placeholderContentFit="contain"
          placeholder={Images.icon}
          style={styles.profilePic}
        />

        <Text
          fontFamily={"PrimaryBold"}
          textTransform={"capitalize"}
          textAlign={"center"}
        >
          {user?.profile.name}
        </Text>
      </Box>

      <Box variant={"surface"} rg={"xl"}>
        <MenuButton
          icon="user"
          label="Edit Profile"
          onPress={navigate("/(protected)/(tabs)/account/edit_profile")}
        />
        <MenuButton
          icon="filetext1"
          label="Privacy Policy"
          onPress={navigate("/privacy_policy")}
        />
        <MenuButton
          icon="profile"
          label="Terms & Conditions"
          onPress={navigate("/terms_and_condition")}
        />
        <MenuButton
          icon="message1"
          label="Help and Support"
          onPress={navigate("/(protected)/(tabs)/account/help_and_support")}
        />
        <MenuButton
          icon="lock"
          label="Settings and Security"
          onPress={navigate("/(protected)/(tabs)/account/settings")}
        />
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <Box flexDirection={"row"} alignItems={"center"} cg={"s"} p={"s"}>
            <AntDesign name="logout" color={palette.red} size={s(18)} />
            <Text>Log out</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </ScreenBox>
  );
};

ProfileScreen.displayName = "ProfileScreen";

const useStyles = createStyleHook(({ borderRadii, colors }) => ({
  profilePic: {
    width: "65@s",
    height: "65@s",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadii.round,
  },
}));
