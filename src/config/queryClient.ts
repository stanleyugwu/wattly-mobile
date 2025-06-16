import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considered fresh for 5 minutes before background refetch
      staleTime: 5 * 60 * 1000,

      // Cache data for 10 minutes to avoid refetching when component remounts
      cacheTime: 10 * 60 * 1000,

      // Retry failed requests 2 times before showing error
      retry: 2,

      // Retry delays increase exponentially: 1s, 2s, 4s, etc.
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch data when window regains focus (default: true)
      refetchOnWindowFocus: true,

      // Refetch data on reconnect (default: true)
      refetchOnReconnect: true,

      // Refetch data on mount (default: true)
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations 1 time (optional)
      retry: 1,
    },
  },
});
