import { Box, Image, Text } from "@/components";
import { useAuth } from "@/contexts/auth";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/theme";
import { Images } from "@assets/index";
import { Octicons } from "@expo/vector-icons";
import { FC, useState } from "react";
import { Pressable } from "react-native";
import { scale, ScaledSheet } from "react-native-size-matters";

interface WalletProps {}

/**
 * Renders Wallet image with balance
 */
export const Wallet: FC<WalletProps> = (props) => {
  const [balanceShown, setBalanceShown] = useState(false);
  const { colors, palette } = useTheme();
  const auth = useAuth();

  const balance = formatCurrency(+(auth.user?.profile.balance || 0));

  return (
    <Box>
      <Image source={Images.wallet} style={styles.walletImg} />
      <Box
        position={"absolute"}
        rg={"s"}
        alignSelf={"center"}
        bottom={"20%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Pressable onPress={() => setBalanceShown((prev) => !prev)}>
          <Box flexDirection={"row"} alignItems={"center"} cg={"xxs"}>
            <Text
              variant={"small"}
              fontFamily={"PrimaryBold"}
              color={"primaryText"}
            >
              Show balance
            </Text>
            <Octicons
              name={balanceShown ? "eye-closed" : "eye"}
              color={colors.primaryText}
              size={scale(14)}
              allowFontScaling={false}
            />
          </Box>
        </Pressable>
        <Box>
          <Text variant={"heading"} color={"primaryText"}>
            {balanceShown ? balance : "*******"}
          </Text>
          <Text
            variant={"small"}
            textAlign={"center"}
            style={{ fontSize: scale(12), color: palette.gray100 }}
          >
            Total Balance
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const styles = ScaledSheet.create({
  walletImg: {
    alignSelf: "center",
    width: "420@s",
    height: "auto",
    aspectRatio: 2 / 1,
  },
});
