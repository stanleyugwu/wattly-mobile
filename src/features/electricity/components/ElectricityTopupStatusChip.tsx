import { Box, BoxProps, Text, TextProps } from "@/components";
import { useTheme } from "@/theme";
import { FC } from "react";
import { IElectricityTx } from "../types";
import { isTxPending, isTxSuccessful } from "../utils";

interface ElectricityTopupStatusChipProps extends BoxProps {
  tx: IElectricityTx;
  textProps?: TextProps;
}

/**
 * Renders a status chip for showing colorful electricity transaction status
 */
export const ElectricityTopupStatusChip: FC<
  ElectricityTopupStatusChipProps
> = ({ tx, textProps, ...rest }) => {
  const { palette } = useTheme();
  const txPending = isTxPending(tx);
  const txSuccessful = isTxSuccessful(tx);
  const txReversed = tx.response?.code === "040";

  return (
    <Box
      borderRadius={"round"}
      alignItems={"center"}
      justifyContent={"center"}
      p={"xxs"}
      px={"xl"}
      style={{
        backgroundColor: txSuccessful
          ? palette.green200
          : txPending
          ? palette.orange + "50"
          : txReversed
          ? palette.gray05 + "50"
          : palette.red100 + "50",
      }}
      {...rest}
    >
      <Text
        variant={"small"}
        textAlign={"center"}
        fontFamily={"PrimaryBold"}
        {...textProps}
        style={[
          {
            color: txSuccessful
              ? palette.green + "80"
              : txPending
              ? palette.orange + "80"
              : txReversed
              ? palette.gray05 + "80"
              : palette.red + "80",
          },
          textProps?.style,
        ]}
      >
        {txSuccessful
          ? "Successful"
          : txPending
          ? "Processing"
          : txReversed
          ? "Reversed"
          : "Failed"}
      </Text>
    </Box>
  );
};
