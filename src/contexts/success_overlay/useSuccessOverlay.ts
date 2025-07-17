import { useContext } from "react";

import { OverlaySuccessContext } from "./context";

export const useSuccessOverlay = () => useContext(OverlaySuccessContext);
