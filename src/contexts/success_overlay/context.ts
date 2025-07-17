import { createContext } from "react";
import { OverlaySuccessContextActions } from "./types";

export const OverlaySuccessContext =
  createContext<OverlaySuccessContextActions>({
    show: (options) => {},
    hide: () => {},
  });
