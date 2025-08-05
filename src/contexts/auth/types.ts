import { User } from "@/types";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  setTxPin: (pin: string) => void;
  syncProfile: (profile: User["profile"]) => void;
}
