import React, { useMemo, type FC } from "react";
import { s, ScaledSheet } from "react-native-size-matters";

import { Box, Button, Text } from "@/components";
import { getFirstValidValue } from "@/lib/utils";
import { useTheme } from "@/theme";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import {
  DefaultSectionT,
  SectionList,
  SectionListData,
  SectionListRenderItem,
} from "react-native";
import { ElectricityTxHistory } from "./components";
import { useGetElectricityTxs } from "./hooks";
import { IElectricityTx } from "./types";

export function groupAndSortTransactions(transactions: IElectricityTx[]) {
  const grouped = transactions.reduce((acc, tx) => {
    const txDate = getFirstValidValue(
      tx?.response?.transaction_date,
      tx.updated_at
    );
    const month = dayjs(txDate || new Date()).format("MMMM YYYY");
    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {} as Record<string, IElectricityTx[]>);

  const sortedSections = Object.entries(grouped)
    .sort(([a], [b]) => {
      const dateA = dayjs(a, "MMMM YYYY");
      const dateB = dayjs(b, "MMMM YYYY");
      return dateB.valueOf() - dateA.valueOf(); // descending
    })
    .map(([month, data]) => ({
      title: month,
      data,
    }));

  return sortedSections;
}

interface ElectricityTxHistoryScreenProps {}

/**
 * Component for `ElectricityTxHistory` screen
 */
export const ElectricityTxHistoryScreen: FC<ElectricityTxHistoryScreenProps> = (
  props
) => {
  const { data: txs, isLoading } = useGetElectricityTxs();
  const { spacing, colors } = useTheme();

  const sections = useMemo(
    () => groupAndSortTransactions(txs || []) || [],
    [txs]
  );

  const renderTx: SectionListRenderItem<IElectricityTx> = ({ item: tx }) => {
    return <ElectricityTxHistory tx={tx} key={tx.id} />;
  };

  const renderSectionHeader:
    | ((info: {
        section: SectionListData<IElectricityTx, DefaultSectionT>;
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
          We couldn't find any electricity transaction history. You haven't
          top-up electricity yet!
        </Text>
        <Button
          label="Top-up Now"
          onPress={() => router.navigate("/(protected)/electricity")}
        />
      </Box>
    );
  };

  return (
    <Box p={{ phone: "m" }}>
      <SectionList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderNoTxView}
        contentContainerStyle={{ rowGap: spacing.s }}
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderTx}
      />
    </Box>
  );
};

ElectricityTxHistoryScreen.displayName = "ElectricityTxHistoryScreen";

const styles = ScaledSheet.create({});
