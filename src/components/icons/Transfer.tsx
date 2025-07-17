import * as React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";

export const TransferIcon = ({ color = "#229EFF", ...rest }: SvgProps) => (
  <Svg width={33} height={33} fill="none" {...rest}>
    <Rect width={32} height={32} fill={color} rx={16} />
    <Path
      stroke={"#FFFFFF"}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9.25h3.75m0 0V13m0-3.75L14.5 17.5"
    />
    <Path
      stroke={"#FFFFFF"}
      strokeLinecap="round"
      d="M21.25 16.75a6 6 0 1 1-6-6"
    />
  </Svg>
);
