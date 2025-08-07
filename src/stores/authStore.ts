import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: "admin" | "manager" | "user";
  avatar?: string;
}

interface AuthState {
  // User State
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;

  // Auth Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;

  // Permissions
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        isAuthenticated: false,
        token: null,

        // Actions
        login: (user, token) =>
          set({ user, token, isAuthenticated: true }, false, "auth/login"),

        logout: () =>
          set(
            { user: null, token: null, isAuthenticated: false },
            false,
            "auth/logout"
          ),

        updateUser: (userData) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...userData } : null,
            }),
            false,
            "auth/updateUser"
          ),

        setToken: (token) => set({ token }, false, "auth/setToken"),

        // Permission Helpers
        hasPermission: (permission) => {
          const { user } = get();
          if (!user) return false;

          // Simple permission system - can be enhanced
          const permissions = {
            admin: ["read", "write", "delete", "admin"],
            manager: ["read", "write"],
            user: ["read"],
          };

          return permissions[user.role]?.includes(permission) || false;
        },

        isAdmin: () => {
          const { user } = get();
          return user?.role === "admin";
        },

        isManager: () => {
          const { user } = get();
          return user?.role === "manager" || user?.role === "admin";
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);
