import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useLogout } from "../hooks/useAuth";
import { NotificationDrawer } from "./NotificationDrawer";
import { useUnreadNotificationsCount } from "../hooks/useNotifications";

export function Header() {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(false);
  const { unreadCount, isLoading } = useUnreadNotificationsCount();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
        {/* Left side - Empty (for balance) */}
        <div className="flex items-center">
          {/* Left side intentionally empty for visual balance */}
        </div>

        {/* Right side - User Info, Notification, and Logout */}
        <div className="flex items-center space-x-6">
          {/* User Info */}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>

          {/* Notification icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors relative"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v4.5l2.25 2.25a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V9.75a6 6 0 0 1 6-6z"
                />
              </svg>

              {/* Notification indicator */}
              {!isLoading && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Logout icon */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            title="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </>
  );
}
