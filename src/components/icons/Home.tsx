import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const HomeIcon: React.FC<SvgProps> = ({ color, ...rest }) => (
  <Svg width={25} height={25} fill="none" {...rest}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.98}
      d="M15.402 17.02c-.8.622-1.85 1-3 1s-2.201-.378-3-1"
    />
    <Path
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={1.98}
      d="M2.753 13.233c-.353-2.297-.53-3.445-.095-4.464.434-1.018 1.398-1.715 3.325-3.108l1.44-1.041c2.397-1.733 3.595-2.6 4.979-2.6 1.383 0 2.581.867 4.979 2.6l1.44 1.041c1.926 1.393 2.89 2.09 3.324 3.108.435 1.019.258 2.167-.095 4.464l-.3 1.96c-.501 3.256-.752 4.884-1.92 5.856-1.167.971-2.875.971-6.29.971h-2.277c-3.415 0-5.123 0-6.29-.971-1.168-.972-1.419-2.6-1.919-5.857l-.301-1.959Z"
    />
  </Svg>
);
