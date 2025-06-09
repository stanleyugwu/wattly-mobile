export enum FontName {
  Primary = "Primary",
  PrimaryItalic = "PrimaryItalic",
  PrimaryBold = "PrimaryBold",
  PrimaryBoldItalic = "PrimaryBoldItalic",
  PrimaryLight = "PrimaryLight",
  PrimaryLightItalic = "PrimaryLightItalic",
  PrimaryBlack = "PrimaryBlack",
  PrimaryBlackItalic = "PrimaryBlackItalic",
  PrimaryThin = "PrimaryThin",
  PrimaryThinItalic = "PrimaryThinItalic",
  SpaceMono = "SpaceMono",
}

export type Font = keyof typeof FontName;
