import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
  Box,
  EmptyDataView,
  NetworkError,
  Text,
} from "@/components";
import { useTheme } from "@/theme";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { ListRenderItem } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { UseQueryResult } from "react-query";
import { ElectricityProvider } from "../types";
import { ElectricityTxSkeleton } from "./ElectricityTxSkeleton";
import { ProviderButton, ProviderButtonProps } from "./ProviderButton";

interface ProviderSheetProps extends Omit<BottomSheetProps, "children"> {
  query: UseQueryResult<ElectricityProvider[]>;
  onProviderSelect: ProviderButtonProps["onPress"];
}

/**
 * Renders a bottom sheet for selecting electricity provider for top up
 */
export const ProviderSheet = forwardRef<BottomSheetRef, ProviderSheetProps>(
  ({ query, onProviderSelect, ...otherProps }, ref) => {
    const { insets, colors } = useTheme();
    const renderProvider = useCallback<ListRenderItem<ElectricityProvider>>(
      ({ item: provider }) => (
        <ProviderButton onPress={onProviderSelect} provider={provider} />
      ),
      []
    );

    return (
      <BottomSheet ref={ref} enablePanDownToClose {...otherProps}>
        <Box my={"s"}>
          <Text variant={"heading3"} textAlign={"center"}>
            Service Provider
          </Text>
          <Text variant={"small"} textAlign={"center"} color={"textMuted"}>
            Select an electricity service provider for top-up
          </Text>
        </Box>
        {query.isLoading || query.isFetching ? (
          <Box mt={"xxl"}>
            <ElectricityTxSkeleton count={6} show />
          </Box>
        ) : query.isError ? (
          <NetworkError
            onRetry={query.refetch}
            body="Couldn't fetch service providers, please try again"
          />
        ) : (
          <BottomSheetFlatList
            ListEmptyComponent={
              <EmptyDataView
                title="No service provider"
                body="No electricity service provider available at the moment, please check back later"
              />
            }
            data={query.data}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            keyExtractor={(i) => i.name}
            renderItem={renderProvider}
          />
        )}
      </BottomSheet>
    );
  }
);

const styles = ScaledSheet.create({});
