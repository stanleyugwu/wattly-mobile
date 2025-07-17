import { createContext } from "react";

export const OverlayLoaderContext = createContext({
  show: (text?: string) => {},
  hide: () => {},
});
