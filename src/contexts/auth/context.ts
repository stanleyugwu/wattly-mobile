import { createContext } from "react";

import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSignedIn: false,
  signIn(user) {
    return;
  },
  signOut() {
    return;
  },
});
