import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "signin",
};

export default function AccountLayout() {
  return (
    <Stack initialRouteName="index">
      {/* This is the layout for the profile screens */}
      <Stack.Screen name="index" options={{ headerTitle: "Account" }} />
      <Stack.Screen
        name="edit_profile"
        options={{ headerTitle: "Edit Profile" }}
      />

      {/* Settings ans sub screens */}
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Settings and Security",
        }}
      />
      <Stack.Screen
        name="about"
        options={{ headerTitle: "About", headerBackTitle: "Settings" }}
      />
      <Stack.Screen
        name="delete_account"
        options={{ headerTitle: "Delete Account", headerBackTitle: "Settings" }}
      />
      <Stack.Screen
        name="change_password"
        options={{
          headerTitle: "Change Password",
          headerBackTitle: "Settings",
        }}
      />
      {/* Settings ans sub screens */}
      <Stack.Screen
        name="help_and_support"
        options={{ headerTitle: "Contact and Support" }}
      />
    </Stack>
  );
}
