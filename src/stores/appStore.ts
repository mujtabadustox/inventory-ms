import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  sidebarWidth: number;

  // Loading States
  globalLoading: boolean;
  loadingMessage: string;

  // Notifications
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
  }>;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setSidebarWidth: (width: number) => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  addNotification: (
    notification: Omit<AppState["notifications"][0], "id">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial State
      sidebarCollapsed: false,
      theme: "light",
      sidebarWidth: 256, // 16rem = 256px
      globalLoading: false,
      loadingMessage: "",
      notifications: [],

      // Actions
      toggleSidebar: () =>
        set(
          (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
          false,
          "app/toggleSidebar"
        ),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }, false, "app/setSidebarCollapsed"),

      setTheme: (theme) => set({ theme }, false, "app/setTheme"),

      setSidebarWidth: (width) =>
        set({ sidebarWidth: width }, false, "app/setSidebarWidth"),

      setGlobalLoading: (loading, message = "") =>
        set(
          { globalLoading: loading, loadingMessage: message },
          false,
          "app/setGlobalLoading"
        ),

      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };

        set(
          (state) => ({
            notifications: [...state.notifications, newNotification],
          }),
          false,
          "app/addNotification"
        );

        // Auto-remove notification after duration (default: 5000ms)
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          "app/removeNotification"
        ),

      clearNotifications: () =>
        set({ notifications: [] }, false, "app/clearNotifications"),
    }),
    {
      name: "app-store",
    }
  )
);
