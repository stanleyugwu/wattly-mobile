import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/contexts/auth";

export default function ProtectedLayout() {
  const auth = useAuth();

  if (!auth.isSignedIn) {
    // Redirect to login if not authenticated
    return <Redirect href="/auth/signin" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="electricity/index"
        options={{
          headerTitle: "",
          title: "",
        }}
      />
      <Stack.Screen
        name="electricity/tx_details"
        options={{
          headerTitle: "Transaction Details",
          title: "Transaction Details",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="electricity/tx_history"
        options={{
          headerTitle: "Electricity Transactions",
          title: "Electricity Transactions",
          headerBackTitle: "Top-up",
        }}
      />
      <Stack.Screen
        name="wallet/add_money"
        options={{
          headerTitle: "Wallet Top-up",
          title: "Wallet Top-up",
        }}
      />
    </Stack>
  );
}
