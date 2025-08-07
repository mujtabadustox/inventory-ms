import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, tokenStorage } from "../lib/auth";
import { useAuthStore } from "../stores/authStore";

// Query keys for auth
export const authKeys = {
  user: ["auth", "user"] as const,
  isAuthenticated: ["auth", "isAuthenticated"] as const,
};

// Types for signup
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Mock login with admin credentials
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check for admin credentials
      if (credentials.email === "admin" && credentials.password === "12345") {
        const mockTokens = {
          accessToken: `admin_access_token_${Date.now()}`,
          refreshToken: `admin_refresh_token_${Date.now()}`,
        };

        // Store tokens
        tokenStorage.setAccessToken(mockTokens.accessToken);
        tokenStorage.setRefreshToken(mockTokens.refreshToken);

        return {
          tokens: mockTokens,
          user: {
            id: "admin_001",
            email: "admin@inventory.com",
            name: "Mujtaba",
            firstName: "Mujtaba",
            lastName: "",
            role: "admin" as const,
          },
        };
      }

      // For any other credentials, simulate failure
      throw new Error("Invalid credentials");
    },
    onSuccess: (result) => {
      // Update Zustand auth store
      login(result.user, result.tokens.accessToken);

      // Update React Query cache
      queryClient.setQueryData(authKeys.isAuthenticated, true);
      queryClient.setQueryData(authKeys.user, result.user);

      // Invalidate any cached data that might be user-specific
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Update Zustand auth store
      logout();

      // Clear all cached data
      queryClient.clear();

      // Update auth state
      queryClient.setQueryData(authKeys.isAuthenticated, false);
    },
  });
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  return {
    isAuthenticated: tokenStorage.isAuthenticated(),
    checkAuth: () => tokenStorage.isAuthenticated(),
  };
}

// Hook for signup
export function useSignup() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      // Mock signup - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful signup
      const mockTokens = {
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
      };

      // Store tokens
      tokenStorage.setAccessToken(mockTokens.accessToken);
      tokenStorage.setRefreshToken(mockTokens.refreshToken);

      return { tokens: mockTokens, user: data };
    },
    onSuccess: (result) => {
      // Update auth state with user data
      const user = {
        id: `user_${Date.now()}`,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: "user" as const,
      };

      // Update Zustand auth store
      login(user, result.tokens.accessToken);

      // Update React Query cache
      queryClient.setQueryData(authKeys.isAuthenticated, true);
      queryClient.setQueryData(authKeys.user, user);

      // Invalidate any cached data that might be user-specific
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
    },
  });
}

// Hook for token refresh
export function useRefreshToken() {
  return useMutation({
    mutationFn: authService.refreshToken,
    onError: (error) => {
      console.error("Token refresh failed:", error);
      // Force logout on refresh failure
      authService.logout();
    },
  });
}
