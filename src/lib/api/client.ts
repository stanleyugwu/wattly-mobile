import axios, { AxiosError } from "axios";
import { router } from "expo-router";

import { STORE_KEYS } from "@/constants";
import { authTokenRef } from "@/contexts/auth/tokenRef";
import { storageService } from "@/services";
import { logger } from "../logger";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 20000,
  timeoutErrorMessage: "Your request took too long, please try again",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authTokenRef.current || null;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error: AxiosError<{ message: string; errors: string | string[] }>) => {
    // make both axios and server error message live in error.message
    if (error.response?.data) {
      error.message =
        error.response.data?.message || error.message || "Something went wrong";
      const errors = error.response.data?.errors;

      if (typeof errors === "string") error.message = errors;
      else if (errors instanceof Object)
        error.message = Object.values(errors).flat()[0];
    }

    // Handle 401 response errors
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config?.url?.includes("/sign_in")
    ) {
      // Handle unauthorized access, e.g., redirect to login
      logger.info("API client reponse interceptor, unauthorized access", {
        error,
      });
      router.dismissTo("/auth/signin");
      storageService.removeItem(STORE_KEYS.USER_DATA);
    }
    return Promise.reject(error);
  }
);

export const apiClient = axiosInstance;
