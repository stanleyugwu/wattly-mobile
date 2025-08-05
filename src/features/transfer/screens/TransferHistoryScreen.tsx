import React, { useMemo, type FC } from "react";
import { s } from "react-native-size-matters";

import { Box, Button, Text } from "@/components";
import { groupAndSortRecords } from "@/lib/utils";
import { useTheme } from "@/theme";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  DefaultSectionT,
  SectionList,
  SectionListData,
  SectionListRenderItem,
} from "react-native";
import { TransferTx, TransferTxSkeleton } from "../components";
import { useGetTransferHistory } from "../hooks";
import { TransferTransaction } from "../types";

interface TransferHistoryScreenProps {}

/**
 * Component for `TransferHistory` screen
 */
export const TransferHistoryScreen: FC<TransferHistoryScreenProps> = (
  props
) => {
  const txHistory = useGetTransferHistory();
  const { spacing, colors, insets } = useTheme();

  const sections = useMemo(
    () =>
      groupAndSortRecords(
        txHistory.data || [],
        (transfer) => transfer.updated_at
      ) || [],
    [txHistory.data]
  );
  sections.map((d) => d.data[0]);
  const renderTx: SectionListRenderItem<TransferTransaction> = ({
    item: tx,
  }) => {
    return <TransferTx tx={tx} key={tx.id} />;
  };

  const renderSectionHeader:
    | ((info: {
        section: SectionListData<TransferTransaction, DefaultSectionT>;
      }) => React.ReactElement | null)
    | undefined = ({ section: { title } }) => {
    return (
      <Box
        bg={"surface"}
        width={"auto"}
        alignSelf={"flex-start"}
        p={"xs"}
        px={"s"}
        flexDirection={"row"}
        alignItems={"center"}
        cg={"xxs"}
        borderRadius={"round"}
      >
        <AntDesign name="calendar" size={s(14)} color={colors.text} />
        <Text fontFamily={"PrimaryBlack"}>{title}</Text>
      </Box>
    );
  };

  const renderNoTxView = () => {
    return (
      <Box variant={"surface"} rg={"xxs"} alignItems={"center"} py={"xxl"}>
        <FontAwesome6 name="face-sad-tear" size={s(40)} />
        <Text variant={"heading3"}>You haven't top-up yet!</Text>
        <Text textAlign={"center"} color={"textMuted"} mb={"xxl"}>
          We couldn't find any transfer transaction. You haven't transferred
          funds to anyone yet!
        </Text>
        <Button
          label="Transfer Now"
          onPress={() => router.navigate("/(protected)/transfer")}
        />
      </Box>
    );
  };

  return (
    <Box p={{ phone: "m" }} style={{ paddingBottom: insets.bottom, flex: 1 }}>
      <TransferTxSkeleton show={txHistory.isLoading} count={8} />
      <SectionList
        onRefresh={txHistory.refetch}
        refreshing={txHistory.isRefetching && !txHistory.isLoading}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderNoTxView}
        contentContainerStyle={{ rowGap: spacing.s }}
        sections={sections?.[0]?.data?.length ? sections : []}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderTx}
      />
    </Box>
  );
};

TransferHistoryScreen.displayName = "TransferHistoryScreen";
