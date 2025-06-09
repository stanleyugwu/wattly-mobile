import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

import { storageService } from "@/services";
import { STORE_KEYS } from "@/constants";
import { User } from "@/types";
import { apiClient } from "@/lib/api";
import { AuthContext } from "./context";
import { logger } from "@/lib/logger";
import { authTokenRef } from "./tokenRef";

/**
 * AuthProvider component provides authentication context to the application.
 * It manages user authentication state, including sign-in and sign-out functionality.
 *
 * NOTE: Also handles manually hiding the splash screen after auth data is loaded
 */
export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await apiClient.post("/auth/signin", { email, password });
    } catch (error) {}
  };

  const signOut = async () => {
    // Implement your sign-out logic here
    // For example, clear the user data and update the userData.
    setUserData(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await storageService.getItem<User>(STORE_KEYS.USER_DATA);
      authTokenRef.current = userData?.token || null;

      setUserData(userData);
      setIsLoading(false);
      logger.info(
        `AuthProvider:: User data loaded: ${JSON.stringify(userData)}`
      );

      SplashScreen.hideAsync().catch((error) => {
        logger.error(`SplashScreen:: Error hiding splash screen: ${error}`);
      });
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
