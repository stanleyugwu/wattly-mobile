import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/contexts/auth";

export default function ProtectedLayout() {
  const auth = useAuth();

  if (!auth.isSignedIn || !auth.user?.profile) {
    // Redirect to login if not authenticated
    return <Redirect href="/auth/signin" />;
  }

  if (!auth.user.profile.transaction_pin) {
    return <Redirect href={"/auth/create_transfer_pin"} />;
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
        name="electricity/tx_receipt/[tx_id]"
        options={{
          title: "Electricity Topup Receipt",
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
        name="transfer/index"
        options={{
          headerTitle: "",
          title: "",
          headerBackTitle: "Home",
        }}
      />
      <Stack.Screen
        name="transfer/confirmation/[amount]"
        options={{
          headerTitle: "",
          title: "",
          headerStyle: { backgroundColor: "transparent" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="transfer/transfer_details/[reference]"
        options={{
          headerTitle: "Transaction Receipt",
          title: "Transaction Receipt",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="transfer/transfer_history"
        options={{
          headerTitle: "Transaction History",
          title: "Transaction History",
          headerBackTitle: "Transfer",
        }}
      />
      <Stack.Screen
        name="transfer/qrcode_scan"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="transfer/pin/change"
        options={{
          headerTitle: "Change Pin",
          headerBackTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="transfer/pin/reset_otp_verification"
        options={{
          headerTitle: "",
          headerBackTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="transfer/pin/reset/[otp]"
        options={{
          headerTitle: "Reset Pin",
          headerBackTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="wallet/add_money/index"
        options={{
          headerTitle: "Wallet Top-up",
          title: "Wallet Top-up",
        }}
      />
      <Stack.Screen
        name="wallet/add_money/[payment_url]"
        options={{
          headerTitle: "Wallet Top Up",
          headerBackTitle: "Cancel",
        }}
      />
    </Stack>
  );
}
