import { Tabs } from "expo-router";
import React from "react";

import { MyQrCodeTabButton } from "@/components";
import {
  HistoryIcon,
  HomeIcon,
  ProfileIcon,
  ReferralsIcon,
} from "@/components/icons";
import { useTheme } from "@/theme";

export default function TabLayout() {
  const { colors, palette, isDarkMode, borderRadii } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarStyle: {
          borderRadius: borderRadii.xl,
          borderTopWidth: 0,
          elevation: 10,
          shadowOffset: { height: 1, width: 0 },
          shadowColor: isDarkMode ? palette.white400 : palette.black400,
          shadowRadius: 10,
          shadowOpacity: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <HistoryIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="my_qrcode"
        options={{
          title: "",
          tabBarLabel: "",
          tabBarButton({ onPress, style }) {
            return <MyQrCodeTabButton onPress={onPress} style={style} />;
          },
        }}
      />
      <Tabs.Screen
        name="referrals"
        options={{
          title: "Referrals",
          tabBarIcon: ({ color }) => <ReferralsIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
