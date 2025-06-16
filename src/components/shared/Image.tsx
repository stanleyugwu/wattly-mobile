import { Image as BaseImage, ImageProps as BaseImageProps } from "expo-image";
import { FC } from "react";

export const Image: FC<BaseImageProps> = (props) => {
  return <BaseImage contentFit="contain" {...props} />;
};
