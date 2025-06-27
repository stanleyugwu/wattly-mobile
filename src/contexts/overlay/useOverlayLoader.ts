import { useContext } from "react";

import { OverlayLoaderContext } from "./context";

export const useOverlayLoader = () => useContext(OverlayLoaderContext);
