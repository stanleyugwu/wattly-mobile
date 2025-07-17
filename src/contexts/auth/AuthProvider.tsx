import { useEffect, useState } from "react";

import { STORE_KEYS } from "@/constants";
import { logger } from "@/lib/logger";
import { storageService } from "@/services";
import { User } from "@/types";
import { router } from "expo-router";
import { AuthContext } from "./context";
import { authTokenRef } from "./tokenRef";

/**
 * AuthProvider component provides authentication context to the application.
 * It manages user authentication state, including sign-in and sign-out functionality.
 */
export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = (user: User) => {
    setUserData(user);
    authTokenRef.current = user.token;
    storageService.setItem(STORE_KEYS.USER_DATA, user).then((stored) => {
      if (stored) logger.info("AuthProvider:: persisted user data");
    });
    router.replace("/");
  };

  const signOut = () => {
    setUserData(null);
    storageService.removeItem(STORE_KEYS.USER_DATA);
    authTokenRef.current = null;
    router.dismissTo("/auth/signin");
  };

  const setTxPin = (pin: string) => {
    if (!userData?.profile) return router.navigate("/auth/signin");

    const newData: User = {
      ...userData,
      profile: {
        ...userData?.profile!,
        transaction_pin: pin,
      },
    };
    setUserData(newData);
    storageService.setItem(STORE_KEYS.USER_DATA, newData).then((stored) => {
      if (stored)
        logger.info("AuthProvider:: transfer pin set and user persisted");
    });
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
        setTxPin,
        isSignedIn: !!userData,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
