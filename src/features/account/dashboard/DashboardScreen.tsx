import React, { type FC } from "react";
import { vs } from "react-native-size-matters";

import { Box, Image, NetworkError, ScreenBox, Text } from "@/components";
import { BulbIcon, PlusIcon, TransferIcon } from "@/components/icons";
import { useAuth } from "@/contexts/auth";
import { PROFILE_PIC_BASE_URL } from "@/lib/constants";
import { createStyleHook } from "@/lib/utils";
import { Images } from "@assets/index";
import { router } from "expo-router";
import { Platform, Pressable, ScrollView } from "react-native";
import { ElectricityTxSkeleton, useGetElectricityTxs } from "../../electricity";
import { useGetTransferHistory } from "../../transfer";
import { WalletTxSkeleton } from "../../wallet";
import {
  CurvyIconButton,
  ElectricityTx,
  NotificationIconBtn,
  Wallet,
  WalletTx,
} from "./components";

interface DashboardScreenProps {}

/**
 * Component for `Dashboard` screen
 */
export const DashboardScreen: FC<DashboardScreenProps> = (props) => {
  const { user } = useAuth();
  const { palette, styles } = useStyles();

  const electrictyTxs = useGetElectricityTxs();
  const walletTxs = useGetTransferHistory();

  const electricityData = electrictyTxs.data?.slice(0, 2) || [];
  const walletData = walletTxs.data?.slice(0, 5) || [];

  const profilePicUrl = `${PROFILE_PIC_BASE_URL}/${user?.profile.profile}`;

  return (
    <ScreenBox rowGap={"xxl"}>
      <Box
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box>
          <Text color={"textMuted"}>Good Day,</Text>
          <Text fontFamily={"PrimaryBold"}>{user?.profile.name}</Text>
        </Box>

        <Box flexDirection={"row"} alignItems={"center"} cg={"xs"}>
          <NotificationIconBtn hasUnreadNotification={true} />

          <Pressable
            onPress={() => router.navigate("/(protected)/(tabs)/account")}
          >
            <Image
              source={profilePicUrl}
              contentFit="contain"
              placeholderContentFit="contain"
              placeholder={Images.icon}
              style={styles.profilePic}
            />
          </Pressable>
        </Box>
      </Box>

      <Wallet />
      <Box justifyContent={"center"} alignItems={"center"}>
        <Box
          width={"100%"}
          height={vs(30)}
          borderRadius={"round"}
          style={{ backgroundColor: palette.blue100 }}
        />
        <ScrollView
          style={styles.btnScrollView}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <Box flexDirection={"row"} justifyContent={"space-between"}>
            <CurvyIconButton
              label="Add Money"
              Icon={<PlusIcon />}
              onPress={() => router.navigate("/(protected)/wallet/add_money")}
            />
            <CurvyIconButton
              onPress={() => router.navigate("/(protected)/electricity")}
              label="Electricity"
              Icon={<BulbIcon />}
            />
            <CurvyIconButton
              label="Transfer"
              Icon={<TransferIcon />}
              onPress={() => router.navigate("/(protected)/transfer")}
            />
          </Box>
        </ScrollView>
      </Box>

      <Box variant={"surface"} rg={"s"}>
        {electricityData.length ? (
          <Pressable
            style={{ alignItems: "center" }}
            onPress={() => router.navigate("/(protected)/electricity")}
          >
            <Box
              bg={"primary"}
              p={"xxs"}
              alignSelf={"flex-start"}
              px={"s"}
              borderRadius={"xs"}
            >
              <Text variant={"small"} color={"primaryText"}>
                Buy Again
              </Text>
            </Box>
          </Pressable>
        ) : null}

        {/* Loader */}
        <ElectricityTxSkeleton show={electrictyTxs.isLoading} />

        {/* Render two transactions */}
        {electricityData.map((tx) => (
          <ElectricityTx tx={tx} key={tx.id} />
        ))}

        {/* Render error view */}
        {electrictyTxs.isError ? (
          <NetworkError
            body="Couldn't fetch recent electricity transactions. Try again"
            onRetry={electrictyTxs.refetch}
          />
        ) : null}

        <Box
          mt={"m"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexDirection={"row"}
        >
          <Text variant={"body"} fontFamily={"PrimaryBold"}>
            Recent Transactions
          </Text>
          <Text
            variant={"small"}
            color={"primary"}
            onPress={() =>
              router.navigate("/(protected)/transfer/transfer_history")
            }
          >
            See more
          </Text>
        </Box>

        {/* Loader */}
        <WalletTxSkeleton show={walletTxs.isLoading} />
        {walletTxs.isError ? (
          <NetworkError
            body="Couldn't fetch recent wallet transactions. Try again"
            onRetry={walletTxs.refetch}
          />
        ) : null}

        {/* Render wallet transactions */}
        {walletData.map((tx) => (
          <WalletTx tx={tx} key={tx.id} />
        ))}
      </Box>
    </ScreenBox>
  );
};

DashboardScreen.displayName = "DashboardScreen";

const useStyles = createStyleHook(({ borderRadii, colors }) => ({
  btnScrollView: {
    flex: 1,
    position: "absolute",
    top: Platform.select({
      android: -13,
      ios: -10,
    }),
  },
  profilePic: {
    width: "45@s",
    height: "45@s",
    borderRadius: borderRadii.round,
    borderWidth: 1,
    borderColor: colors.border,
  },
}));
