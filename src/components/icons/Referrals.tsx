import * as React from "react";
import Svg, { Path, G, Defs, SvgProps, ClipPath } from "react-native-svg";

export const ReferralsIcon: React.FC<SvgProps> = ({ color, ...rest }) => (
  <Svg width={25} height={25} fill="none" {...rest}>
    <G stroke={color} strokeWidth={1.5} clipPath="url(#a)">
      <Path
        strokeLinecap="round"
        d="M21.307 18.02c.75 0 1.345-.471 1.88-1.13 1.096-1.35-.703-2.43-1.389-2.957-.697-.537-1.476-.842-2.265-.913m-1-2a2.5 2.5 0 1 0 0-5M3.759 18.02c-.75 0-1.345-.471-1.88-1.13-1.096-1.35.703-2.43 1.389-2.957.697-.537 1.475-.842 2.265-.913m.5-2a2.5 2.5 0 1 1 0-5"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.617 15.131c-1.022.632-3.701 1.922-2.07 3.536.798.789 1.685 1.353 2.801 1.353h6.37c1.115 0 2.003-.564 2.8-1.353 1.632-1.614-1.047-2.904-2.069-3.536a7.456 7.456 0 0 0-7.832 0Z"
      />
      <Path d="M16.033 7.52a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.533.02h24v24h-24z" />
      </ClipPath>
    </Defs>
  </Svg>
);
