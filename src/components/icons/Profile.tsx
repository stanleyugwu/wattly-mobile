import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const ProfileIcon: React.FC<SvgProps> = ({ color, ...rest }) => (
  <Svg width={25} height={25} fill="none" {...rest}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.176 15.502c-1.414.842-5.124 2.562-2.864 4.715 1.103 1.051 2.332 1.803 3.878 1.803h8.818c1.545 0 2.775-.752 3.878-1.803 2.26-2.153-1.45-3.873-2.865-4.715a10.664 10.664 0 0 0-10.845 0Z"
    />
    <Path
      stroke={color}
      strokeWidth={1.5}
      d="M17.099 6.52a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
    />
  </Svg>
);
