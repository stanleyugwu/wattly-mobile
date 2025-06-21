import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from "react-native-svg";

export const PlusIcon = (props: SvgProps) => (
  <Svg width={33} height={33} fill="none" {...props}>
    <Rect width={32} height={32} x={0.5} y={0.222} fill="#229EFF" rx={16} />
    <G stroke="#fff" strokeLinecap="round" strokeWidth={1.5} clipPath="url(#a)">
      <Path d="M9.833 16.222A6.667 6.667 0 1 0 16.5 9.556" />
      <Path
        strokeLinejoin="round"
        d="M11.599 11.608c.092-.098.187-.193.285-.285m1.914-1.281a6.87 6.87 0 0 1 .369-.153m-4 4c.048-.126.1-.25.154-.372M16.5 13.556v5.333m2.667-2.667h-5.334"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M8.5 8.222h16v16h-16z" />
      </ClipPath>
    </Defs>
  </Svg>
);
