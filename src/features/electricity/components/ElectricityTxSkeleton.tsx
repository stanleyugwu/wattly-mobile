import { Box } from "@/components";
import { useTheme } from "@/theme";
import { Skeleton } from "moti/skeleton";
import { FC } from "react";

export const ElectricityTxSkeleton: FC<{ show: boolean }> = ({ show }) => {
  const { isDarkMode, borderRadii, colors } = useTheme();
  const colorMode = isDarkMode ? "dark" : "light";

  if (!show) return null;

  const items = new Array(2).fill(1);

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
            <Skeleton
              colors={[colors.textMuted, colors.surface]}
              width={50}
              height={50}
              radius={"round"}
              colorMode={colorMode}
            />
            <Box rg={"xs"}>
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
        ))}
      </Box>
    </Skeleton.Group>
  );
};
