import { createContext } from "react";

import type { AuthContextType } from "./type";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSignedIn: false,
  signIn(email, password) {
    return Promise.resolve();
  },
  signOut() {
    return Promise.resolve();
  },
});
