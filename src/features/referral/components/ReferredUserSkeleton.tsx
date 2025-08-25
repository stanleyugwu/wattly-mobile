import { Box, Skeleton, SkeletonGroup } from "@/components";
import { FC } from "react";
import { s } from "react-native-size-matters";

interface ReferredUserSkeletonProps {
  count?: number;
}

/**
 * Referred
 */
export const ReferredUserSkeleton: FC<ReferredUserSkeletonProps> = ({
  count = 4,
}) => {
  return (
    <SkeletonGroup>
      <Box rg={"xs"}>
        {Array.from({ length: count }).map((_, index) => (
          <Box
            flexDirection={"row"}
            alignItems={"center"}
            cg={"xs"}
            key={index.toString()}
          >
            <Skeleton width={s(45)} height={s(45)} radius={"round"} />
            <Box rg={"xxs"} flex={1}>
              <Skeleton width={"70%"} />
              <Skeleton width={"30%"} />
            </Box>
          </Box>
        ))}
      </Box>
    </SkeletonGroup>
  );
};
