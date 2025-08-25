import { useTheme } from "@/theme";

import { Skeleton as BaseSkeleton } from "moti/skeleton";
import React, { FC } from "react";
import { s, vs } from "react-native-size-matters";

type BaseSkeletonProps = Parameters<typeof BaseSkeleton>["0"];
interface SkeletonProps extends BaseSkeletonProps {}

/**
 * Renders themed, pre-styled and cutomizable skeleton loader
 */
export const Skeleton: FC<SkeletonProps> = (props) => {
  const { colors, isDarkMode, palette } = useTheme();
  const mode = isDarkMode ? "dark" : "light";

  return (
    <BaseSkeleton
      width={s(30)}
      height={vs(10)}
      colors={[palette.gray300, colors.surface]}
      colorMode={mode}
      radius={"round"}
      {...props}
    />
  );
};

type BaseSkeletonGroupProps = Parameters<(typeof BaseSkeleton)["Group"]>["0"];
type SkeletonGroupProps = Omit<BaseSkeletonGroupProps, "show"> & {
  show?: boolean;
};
export const SkeletonGroup: FC<SkeletonGroupProps> = ({
  show = true,
  ...rest
}) => {
  return <BaseSkeleton.Group show={show} {...rest} />;
};
