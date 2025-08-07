import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

// Generic API error type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Custom hook for API queries with better error handling
export function useApiQuery<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, ApiError, TData>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn,
    ...options,
  });
}

// Custom hook for API mutations with better error handling
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn">
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    ...options,
  });
}

// Hook to invalidate queries
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateQueries: (queryKey: readonly unknown[]) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    invalidateAllQueries: () => {
      return queryClient.invalidateQueries();
    },
  };
}

// Hook to prefetch queries
export function usePrefetchQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchQuery: <TData>(
      queryKey: readonly unknown[],
      queryFn: () => Promise<TData>,
      options?: { staleTime?: number }
    ) => {
      return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: options?.staleTime,
      });
    },
  };
}
