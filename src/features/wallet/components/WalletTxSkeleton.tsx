import { Box } from "@/components";
import { useTheme } from "@/theme";
import { Skeleton } from "moti/skeleton";
import { FC } from "react";

export const WalletTxSkeleton: FC<{ show: boolean }> = ({ show }) => {
  const { isDarkMode, borderRadii, colors } = useTheme();
  const colorMode = isDarkMode ? "dark" : "light";

  if (!show) return null;

  const items = new Array(4).fill(1);

  return (
    <Skeleton.Group show={show}>
      <Box rg={"xs"}>
        {items.map((_, idx) => (
          <Box
            key={idx}
            flexDirection={"row"}
            cg={"s"}
            bg={"background"}
            p={"s"}
            borderRadius={"xs"}
          >
            <Box rg={"xs"} width={"50%"}>
              <Skeleton
                width={"70%"}
                height={15}
                colorMode={colorMode}
                radius={borderRadii.xs}
              />
              <Box
                width={"100%"}
                flexDirection={"row"}
                alignItems={"flex-start"}
              >
                <Skeleton
                  width={"60%"}
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

            <Box rg={"xs"} width={"50%"} alignItems={"flex-end"}>
              <Skeleton
                width={"100%"}
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
        ))}
      </Box>
    </Skeleton.Group>
  );
};
