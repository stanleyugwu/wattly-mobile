import { Skeleton } from "moti/skeleton";
import { FC } from "react";

import { Box } from "@/components";
import { useTheme } from "@/theme";

export const TransferTxSkeleton: FC<{ show: boolean; count?: number }> = ({
  show,
  count = 2,
}) => {
  const { isDarkMode, borderRadii, colors } = useTheme();
  const colorMode = isDarkMode ? "dark" : "light";

  if (!show) return null;

  return (
    <Skeleton.Group show={show}>
      <Box rg={"xs"}>
        {Array.from({ length: count }).map((_, idx) => (
          <Box
            key={idx}
            flexDirection={"row"}
            cg={"s"}
            bg={"background"}
            p={"s"}
            borderRadius={"xs"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Skeleton
                colors={[colors.textMuted, colors.surface]}
                width={50}
                height={50}
                radius={"round"}
                colorMode={colorMode}
              />
              <Box rg={"xs"} width={"70%"}>
                <Skeleton
                  width={"85%"}
                  height={15}
                  colorMode={colorMode}
                  radius={borderRadii.xs}
                />
                <Skeleton
                  width={"40%"}
                  height={15}
                  colorMode={colorMode}
                  radius={borderRadii.xs}
                />
              </Box>
            </Box>

            <Box width={"30%"}>
              <Skeleton
                width={"100%"}
                height={15}
                colorMode={colorMode}
                radius={borderRadii.xs}
              />
              <Skeleton
                width={"50%"}
                height={15}
                colorMode={colorMode}
                radius={borderRadii.xs}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Skeleton.Group>
  );
};
