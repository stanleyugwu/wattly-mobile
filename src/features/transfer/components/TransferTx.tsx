import { AntDesign } from "@expo/vector-icons";
import dayjs from "dayjs";
import { FC } from "react";
import { Pressable } from "react-native";
import { s } from "react-native-size-matters";

import { Box, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/theme";
import { router } from "expo-router";
import { TransferDetailsScreenParams } from "../screens";
import { TransferTransaction } from "../types";

interface TransferTxProps {
  tx: TransferTransaction;
}

/**
 * Renders a single transaction from list of transactions
 */
export const TransferTx: FC<TransferTxProps> = ({ tx }) => {
  const { user } = useAuth();
  const { palette } = useTheme();

  const txDate = dayjs(tx.updated_at).format("Do MMMM h:mm A") || "N/A";
  const isSender = tx.sender_id === user?.profile.id;

  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/(protected)/transfer/transfer_details/[reference]",
          // @ts-expect-error
          params: {
            ...tx,
            reference: tx.reference,
          } as TransferDetailsScreenParams,
        });
      }}
    >
      <Box
        variant={"surface"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box flexDirection={"row"} alignItems={"center"} cg={"xs"}>
          <Box
            style={{
              transform: [{ rotate: isSender ? "-45deg" : "120deg" }],
            }}
            borderRadius={"round"}
            bg={"background"}
            p={"s"}
          >
            <AntDesign
              name={isSender ? "logout" : "login"}
              color={isSender ? palette.red : palette.green}
              size={s(20)}
            />
          </Box>
          <Box>
            <Text>
              {(isSender ? tx.recipient_name : tx.sender_name) || "Sent"}
            </Text>
            <Text variant={"caption"}>{txDate}</Text>
          </Box>
        </Box>

        <Box>
          <Text
            style={{ color: isSender ? palette.red : palette.green }}
            variant={"small"}
            fontFamily={"PrimaryBold"}
          >
            {isSender ? "-" : "+"}
            {formatCurrency(+tx.amount || 0)}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
};
