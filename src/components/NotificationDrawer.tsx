import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMyNotifications,
  useUpdateNotification,
  useDeleteNotification,
} from "../hooks/useNotifications";
import type { Notification } from "../services/api";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationFilters {
  type: string;
  status: string;
  search: string;
}

export function NotificationDrawer({
  isOpen,
  onClose,
}: NotificationDrawerProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<NotificationFilters>({
    type: "",
    status: "",
    search: "",
  });

  // Fetch notifications with real-time updates
  const { data: notifications = [], isLoading, error } = useMyNotifications();
  const updateNotificationMutation = useUpdateNotification();
  const deleteNotificationMutation = useDeleteNotification();

  // Filter notifications based on current filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        filters.search === "" ||
        notification.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        notification.notification_type
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesType =
        filters.type === "" || notification.notification_type === filters.type;
      const matchesStatus =
        filters.status === "" || notification.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, filters]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (notification.status === "unread") {
      updateNotificationMutation.mutate({
        notification_id: notification.id,
        data: {
          notification_type: notification.notification_type,
          description: notification.description,
          status: "read",
        },
      });
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    // Find the notification to get its full data
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      updateNotificationMutation.mutate({
        notification_id: notificationId,
        data: {
          notification_type: notification.notification_type,
          description: notification.description,
          status: "read",
        },
      });
    }
  };

  const handleMarkAsUnread = (notificationId: string) => {
    updateNotificationMutation.mutate({
      notification_id: notificationId,
      data: {
        status: "unread",
      },
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const handleFilterChange = (
    field: keyof NotificationFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      case "low_stock":
        return "📦";
      case "order_update":
        return "📋";
      case "system":
        return "⚙️";
      case "inventory":
        return "🏪";
      default:
        return "📢";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      case "low_stock":
        return "text-orange-600 bg-orange-100";
      case "order_update":
        return "text-purple-600 bg-purple-100";
      case "system":
        return "text-gray-600 bg-gray-100";
      case "inventory":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Get unique notification types for filter
  const notificationTypes = useMemo(() => {
    const types = [...new Set(notifications.map((n) => n.notification_type))];
    return types.sort();
  }, [notifications]);

  // Get notification stats
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => n.status === "unread").length;
    const read = total - unread;

    return { total, unread, read };
  }, [notifications]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            {stats.unread > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {stats.unread} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-around p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {stats.total}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {stats.unread}
            </div>
            <div className="text-xs text-blue-500">Unread</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {stats.read}
            </div>
            <div className="text-xs text-green-500">Read</div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search notifications..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Type and Status filters */}
          <div className="flex space-x-2">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {notificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              Error loading notifications
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 transition-colors cursor-pointer hover:bg-gray-50 ${
                    notification.status === "unread"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">
                        {getTypeIcon(notification.notification_type)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${
                            notification.status === "unread"
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.notification_type
                            .replace("_", " ")
                            .toUpperCase()}
                        </p>
                        <span className="text-xs text-gray-500">
                          {notification.created_at
                            ? formatTimestamp(notification.created_at)
                            : "Recently"}
                        </span>
                      </div>

                      <p
                        className={`text-sm mt-1 ${
                          notification.status === "unread"
                            ? "text-gray-800"
                            : "text-gray-600"
                        }`}
                      >
                        {notification.description}
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            notification.notification_type
                          )}`}
                        >
                          {notification.notification_type}
                        </span>

                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            notification.status === "unread"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {notification.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                    {notification.status === "unread" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsUnread(notification.id);
                        }}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        Mark as Unread
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
