import { createContext } from "react";

import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSignedIn: false,
  setTxPin(pin) {
    return null;
  },
  signIn(user) {
    return;
  },
  signOut() {
    return;
  },
  syncProfile(profile) {
    return null;
  },
});
