import { useEffect, useState } from "react";

import { storageService } from "@/services";
import { STORE_KEYS } from "@/constants";
import { AuthContext } from "./context";
import { logger } from "@/lib/logger";
import { authTokenRef } from "./tokenRef";
import { User } from "@/types";
import { router } from "expo-router";

/**
 * AuthProvider component provides authentication context to the application.
 * It manages user authentication state, including sign-in and sign-out functionality.
 */
export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = (user: User) => {
    setUserData(user);
    storageService.setItem(STORE_KEYS.USER_DATA, user).then((stored) => {
      if (stored) logger.info("AuthProvider:: persisted user data");
    });
    router.replace("/");
  };

  const signOut = () => {
    setUserData(null);
    storageService.removeItem(STORE_KEYS.USER_DATA);
    router.dismissTo("/auth/signin");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // storageService.removeItem(STORE_KEYS.USER_DATA);
      // return;
      const userData = await storageService.getItem<User>(STORE_KEYS.USER_DATA);
      authTokenRef.current = userData?.token || null;

      setUserData(userData || null);
      setIsLoading(false);
      logger.info(
        `AuthProvider:: User data loaded: ${JSON.stringify(userData)}`
      );
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        isLoading,
        signIn,
        signOut,
        isSignedIn: !!userData,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
