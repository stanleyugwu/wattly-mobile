import { Text, View } from "@/components/Themed";

export default function SignInScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign In</Text>
      <Text style={{ marginTop: 10 }}>
        Please enter your credentials to sign in
      </Text>
    </View>
  );
}
