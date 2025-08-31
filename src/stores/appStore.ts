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

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setSidebarWidth: (width: number) => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial State
      sidebarCollapsed: false,
      theme: "light",
      sidebarWidth: 256, // 16rem = 256px
      globalLoading: false,
      loadingMessage: "",

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
    }),
    {
      name: "app-store",
    }
  )
);
