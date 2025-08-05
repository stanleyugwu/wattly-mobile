import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, type FC } from "react";
import { Alert, Pressable } from "react-native";
import { s } from "react-native-size-matters";

import { Box, Button, ScreenBox, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { Toast } from "@/lib/toast";
import { useTheme } from "@/theme";
import { deleteAccount } from "../api";

const REASONS: Array<{ id: string; text: string }> = [
  {
    id: "customer",
    text: "Poor customer support",
  },
  {
    id: "no_need",
    text: "No longer need the App",
  },
  {
    id: "no_features",
    text: "Lack of desired features",
  },
  {
    id: "difficulty",
    text: "Difficult to use/navigate",
  },
  {
    id: "privacy_concerns",
    text: "Privacy or security concerns",
  },
  {
    id: "others",
    text: "Other reasons",
  },
];

interface CheckButtonProps {
  onCheck: VoidFunction;
  checked: boolean;
  label: string;
}

const CheckButton: FC<CheckButtonProps> = ({ checked, label, onCheck }) => {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onCheck}>
      <Box
        flexDirection={"row"}
        alignItems={"center"}
        bg={"background"}
        p={"m"}
        borderRadius={"m"}
        cg={"xs"}
      >
        <MaterialIcons
          name={checked ? "check-box" : "check-box-outline-blank"}
          size={s(24)}
          color={colors.text}
        />
        <Text fontFamily={"PrimaryBold"}>{label}</Text>
      </Box>
    </Pressable>
  );
};

interface DeleteAccountScreenProps {}

/**
 * Component for `DeleteAccount` screen
 */
export const DeleteAccountScreen: FC<DeleteAccountScreenProps> = (props) => {
  const [deleting, setDeleting] = useState(false);
  const { signOut, user } = useAuth();
  const [checkedReasons, setCheckedReasons] = useState<Record<string, string>>(
    {}
  );

  const handleDeleteAccount = async () => {
    const completeDeletion = async () => {
      try {
        setDeleting(true);

        await deleteAccount(user?.profile.email!);
        signOut();

        Toast.success("Account deleted successfully");
      } catch (error) {
        Toast.error("Account not deleted, please try again");
      } finally {
        setDeleting(false);
      }
    };

    Alert.alert(
      "Delete Account?",
      "This will permanently delete your account, cancel any active orders, and erase all data.\n\nNote: This action cannot be undone.",
      [
        {
          text: "Yes, delete",
          isPreferred: false,
          onPress: completeDeletion,
          style: "destructive",
        },
        { text: "No", isPreferred: true, style: "default" },
      ]
    );
  };

  return (
    <ScreenBox inSafeArea={{ top: false }} rg={"l"}>
      <Text textAlign={"center"}>
        Please tell us why you want to delete your account
      </Text>
      <Box variant={"surface"} rg={"l"}>
        {REASONS.map((reason) => (
          <CheckButton
            onCheck={() => {
              const newReasons = { ...checkedReasons };
              if (newReasons[reason.id]) delete newReasons[reason.id];
              else newReasons[reason.id] = reason.id;
              setCheckedReasons(newReasons);
            }}
            label={reason.text}
            checked={!!checkedReasons[reason.id]}
            key={reason.id}
          />
        ))}
      </Box>

      <Button
        label="Continue"
        disabled={!Object.values(checkedReasons || {}).length}
        loading={deleting}
        onPress={handleDeleteAccount}
      />
    </ScreenBox>
  );
};

DeleteAccountScreen.displayName = "DeleteAccountScreen";
