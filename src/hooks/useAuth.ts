import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService, tokenStorage } from "../lib/auth";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../services/api";
import type {
  SignupRequest,
  LoginResponse,
  SignupResponse,
  ForgotPasswordRequest,
} from "../services/api";

// Query keys for auth
export const authKeys = {
  user: ["auth", "user"] as const,
  isAuthenticated: ["auth", "isAuthenticated"] as const,
};

// Types for signup
export interface SignupData {
  email: string;
  password: string;
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
    }): Promise<LoginResponse> => {
      // Call the actual login API
      const response = await authApi.login(data);

      // Store tokens - login response has flatter structure
      tokenStorage.setAccessToken(response.access_token);
      tokenStorage.setRefreshToken(response.refresh_token || "");

      return response;
    },
    onSuccess: (result) => {
      // Update auth state with user data from the login response
      const user = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.email.split("@")[0], // Use email prefix as name
        firstName: result.user.email.split("@")[0],
        lastName: "",
        role: result.user.role as "user" | "admin",
      };

      // Update Zustand auth store with user and token
      login(user, result.access_token);

      // Update React Query cache
      queryClient.setQueryData(authKeys.isAuthenticated, true);
      queryClient.setQueryData(authKeys.user, user);

      // Invalidate any cached data that might be user-specific
      queryClient.invalidateQueries();

      // Show success toast and redirect to home page
      toast.success("Login successful! Welcome back.");
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    },
  });
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // Just clear local tokens and state - no API call needed
      console.log("Clearing local auth state...");
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("Logout successful, updating UI state...");
      // Update Zustand auth store
      logout();

      // Clear all cached data
      queryClient.clear();

      // Update auth state
      queryClient.setQueryData(authKeys.isAuthenticated, false);

      // Redirect to login page
      navigate("/login");
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupData): Promise<SignupResponse> => {
      // Call the actual signup API
      const response = await authApi.signup(data);

      // Store tokens
      tokenStorage.setAccessToken(response.user.session.access_token);
      tokenStorage.setRefreshToken(response.user.session.refresh_token);

      return response;
    },
    onSuccess: (result) => {
      // Update auth state with user data from the nested structure
      const user = {
        id: result.user.user.id,
        email: result.user.user.email,
        name: result.user.user.email.split("@")[0], // Use email prefix as name
        firstName: result.user.user.email.split("@")[0],
        lastName: "",
        role: result.user.user.role as "user" | "admin",
      };

      // Update Zustand auth store
      login(user, result.user.session.access_token);

      // Update React Query cache
      queryClient.setQueryData(authKeys.isAuthenticated, true);
      queryClient.setQueryData(authKeys.user, user);

      // Invalidate any cached data that might be user-specific
      queryClient.invalidateQueries();

      // Show success toast and redirect to login page
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    },
  });
}

// Hook for token refresh
export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const response = await authApi.refreshToken();
      // Update the stored access token
      tokenStorage.setAccessToken(response.access_token);
      return response.access_token;
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      // Force logout on refresh failure
      authService.logout();
    },
  });
}

// Hook for forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return authApi.forgotPassword(data);
    },
    onSuccess: (result) => {
      toast.success("Password reset email sent! Please check your inbox.");
    },
    onError: (error: any) => {
      console.error("Forgot password failed:", error);
      toast.error("Failed to send reset email. Please try again.");
    },
  });
}
