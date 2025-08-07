import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Time in milliseconds that unused/inactive cache data remains in memory
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (
          error instanceof Error &&
          "status" in error &&
          (error as any).status >= 400 &&
          (error as any).status < 500
        ) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
});
