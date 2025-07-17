export interface ShowOptions {
  headingText: string;
  bodyText: string;
  ctaLabel: string;
  /** Function to be called when the CTA button on success screen is pressed */
  onCTAPress: VoidFunction;
}

export type OverlaySuccessContextActions = {
  show: (options: ShowOptions) => void;
  hide: VoidFunction;
};
