// Auth utilities for JWT token management
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Token storage utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("refreshToken", token);
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },
};

// Auth service for login/logout
export const authService = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthTokens> => {
    // This will be handled by the useLogin hook now
    throw new Error("Use useLogin hook instead");
  },

  logout: (): void => {
    tokenStorage.clearTokens();
    // Also clear Zustand store
    if (typeof window !== "undefined") {
      // Import dynamically to avoid circular dependency
      import("../stores/authStore")
        .then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        })
        .catch(() => {
          // If import fails, just continue
          console.log("Could not clear Zustand store");
        });
    }
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      // Make the refresh request directly to avoid circular dependency with API client
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
        }/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
            // Also try with just the token as the body if the API expects it differently
            token: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Refresh token error:", errorData);
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      const newAccessToken = data.access_token;

      // Store the new access token in both localStorage and Zustand store
      tokenStorage.setAccessToken(newAccessToken);

      // Update Zustand store
      if (typeof window !== "undefined") {
        import("../stores/authStore")
          .then(({ useAuthStore }) => {
            useAuthStore.getState().setToken(newAccessToken);
          })
          .catch(() => {
            // If import fails, just continue
            console.log("Could not update Zustand store");
          });
      }

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear tokens on refresh failure
      tokenStorage.clearTokens();
      throw error;
    }
  },
};
