import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import React, { type FC } from "react";

import { Box, EmptyDataView, NetworkError, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, ListRenderItem, Pressable, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { s } from "react-native-size-matters";
import { ReferredUser } from "./components/ReferredUser";
import { ReferredUserSkeleton } from "./components/ReferredUserSkeleton";
import { useGetReferrals } from "./hooks";
import { IReferredUser } from "./types";

interface ReferralsScreenProps {}

/**
 * Component for `Referrals` screen
 */
export const ReferralsScreen: FC<ReferralsScreenProps> = (props) => {
  const { user } = useAuth();
  const { colors, spacing } = useTheme();
  const referrals = useGetReferrals();
  const { top } = useSafeAreaInsets();

  const appName = Constants.expoConfig?.name;

  const handleShareLink = async () => {
    try {
      const result = await Share.share({
        message: `Hey! 🎉😃 Join me on ${appName} — the easiest and fastest way to top up your electricity and pay other bills. No long queues, no failed payments. Just smooth, stress-free bill payments.\n\nTap this 👇🏼 link to get started:\n${referralLink}`,
        url: referralLink,
        title: "Fast Bills Payment? This App.",
      });

      if (result.action === Share.sharedAction) {
        logger.info(`User opened product share modal`);
      } else if (result.action === Share.dismissedAction) {
        logger.debug(`User dismissed share product link modal`);
      }
    } catch (error) {
      logger.error("Error while sharing product link");
    }
  };

  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(referralLink, {
        inputFormat: Clipboard.StringFormat.PLAIN_TEXT,
      });
      Toast.success("Referral link copied");
    } catch (error) {
      logger.error("ReferralsScreen:: Failed to copy referral link");
    }
  };

  const scheme = Constants.expoConfig?.scheme;
  const referralCode = user?.profile.refferel_link;
  const referralLink = `${scheme}://auth/signup?ref=${referralCode}`;

  const renderReferredUser: ListRenderItem<IReferredUser> = ({
    item: user,
  }) => {
    return <ReferredUser user={user} />;
  };

  const referredUsers = referrals.data?.referrals || [];
  const isLoading = referrals.isLoading || referrals.isFetching;

  return (
    <Box rg={"l"} p={"m"} style={{ paddingTop: top + spacing.m }} flex={1}>
      <Box>
        <Box flexDirection={"row"} alignItems={"center"} cg={"xxs"}>
          <Ionicons name="people" size={s(20)} color={colors.text} />
          <Text variant={"heading2"} fontFamily={"PrimaryBlack"}>
            Refer & Earn
          </Text>
        </Box>
        <Text>
          Refer your friends to{" "}
          <Text fontFamily={"PrimaryBold"}>{appName}</Text> and get amazing
          rewards!!
        </Text>
      </Box>

      <Box rg={"xs"} bg={"surface"} p="m" borderRadius={"m"}>
        <Text fontFamily={"PrimaryBold"}>Referral link:</Text>
        <Box
          flexDirection={"row"}
          p={"s"}
          borderRadius={"m"}
          borderWidth={1}
          alignItems={"center"}
          justifyContent={"center"}
          borderColor={"textMuted"}
        >
          <Text
            numberOfLines={1}
            fontFamily={"PrimaryLight"}
            flexShrink={1}
            ellipsizeMode="middle"
          >
            {referralLink}
          </Text>

          <Box
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            cg={"xs"}
            ml={"s"}
          >
            <Ionicons
              onPress={handleCopyLink}
              name="copy-outline"
              size={s(22)}
              color={colors.primary}
            />

            <Pressable onPress={handleShareLink}>
              <Box bg={"primary"} p={"xs"} px={"m"} borderRadius={"xs"}>
                <Text
                  variant={"caption"}
                  fontFamily={"PrimaryBold"}
                  color={"primaryText"}
                >
                  Share
                </Text>
              </Box>
            </Pressable>
          </Box>
        </Box>
      </Box>

      <Box mt={"xxl"} rg={"xl"} flex={1}>
        <Box flexDirection={"row"} justifyContent={"space-between"}>
          <Text variant={"heading3"}>Referrals</Text>
          <Text color={"textMuted"}>
            Total:{" "}
            <Text color={"text"}>
              {isLoading || referrals.isLoadingError
                ? "-"
                : referredUsers.length}
            </Text>
          </Text>
        </Box>

        <Box flex={1} bg={"surface"} borderRadius={"m"} p={"m"}>
          {isLoading ? (
            <ReferredUserSkeleton count={6} />
          ) : referrals.isError ? (
            <NetworkError
              body="Failed to fetch your referrals, please try again"
              onRetry={referrals.refetch}
            />
          ) : (
            <FlatList
              data={referredUsers}
              style={{
                flex: 1,
              }}
              refreshing={referrals.isFetching && !referrals.isLoading}
              onRefresh={referrals.refetch}
              renderItem={renderReferredUser}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                rowGap: spacing.m,
                paddingBottom: spacing.xl,
              }}
              ListEmptyComponent={
                <EmptyDataView
                  title="No referrals yet!"
                  body="You don't have any referrals yet, share your referral link above to your friends to start earning"
                />
              }
              keyExtractor={(user) => user.id?.toString()}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

ReferralsScreen.displayName = "ReferralsScreen";
