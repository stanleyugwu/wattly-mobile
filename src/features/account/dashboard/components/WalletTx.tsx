import { FC } from "react";

import { Box, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import {
  TransferDetailsScreenParams,
  TransferTransaction,
} from "@/features/transfer";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/theme";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

interface WalletTxProps {
  tx: TransferTransaction;
}

/**
 * Renders wallet transaction card
 */
export const WalletTx: FC<WalletTxProps> = ({ tx }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const amount = formatCurrency(+tx.amount || 0);

  const isCreditx = +tx?.recipient_id === user?.profile.id;
  const txDate = new Date(tx.updated_at).toLocaleString();

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "/(protected)/transfer/transfer_details/[reference]",
          // @ts-expect-error
          params: {
            ...tx,
            reference: tx.reference,
          } as TransferDetailsScreenParams,
        })
      }
    >
      <Box bg={"background"} p="s" borderRadius={"s"}>
        <Box
          flex={1}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box p={"xxs"} width={"50%"}>
            <Text fontFamily={"PrimaryBold"} variant={"small"}>
              {isCreditx ? "Credit Transaction" : "Debit Transaction"}
            </Text>
            <Box flexDirection={"row"} alignItems={"center"} cg={"xxs"}>
              <FontAwesome6 name="money-bill-transfer" color={colors.primary} />
              <Text variant={"small"} color={"textMuted"}>
                {txDate}
              </Text>
            </Box>
          </Box>

          <Box width={"50%"}>
            <Text
              textAlign={"right"}
              fontFamily={"PrimaryBold"}
              variant={"small"}
              color={isCreditx ? "success" : "error"}
            >
              {isCreditx ? "+" : "-"}
              {amount}
            </Text>
            <Text textAlign={"right"} variant={"small"}>
              Successful
            </Text>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
};
