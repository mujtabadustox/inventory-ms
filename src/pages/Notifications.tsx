import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useMyNotifications,
  useUpdateNotification,
} from "../hooks/useNotifications";
import { Select, type SelectOption } from "../components/ui/Select";
import { toast } from "sonner";

// Local interface for filters
interface NotificationFilters {
  notification_type: string;
  status: string;
  search: string;
}

export function Notifications() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<NotificationFilters>({
    notification_type: "",
    status: "",
    search: "",
  });

  // Fetch notifications from real API
  const { data: notifications = [], isLoading, error } = useMyNotifications();
  const updateNotificationMutation = useUpdateNotification();

  // Calculate stats from real data
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => n.status === "unread").length;
    const read = notifications.filter((n) => n.status === "read").length;

    // Group by notification type
    const byType = notifications.reduce((acc, notification) => {
      const type = notification.notification_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      unread,
      read,
      byType,
    };
  }, [notifications]);

  // Filter notifications based on current filters
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter((notification) => {
      const matchesSearch =
        filters.search === "" ||
        notification.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        notification.notification_type
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesType =
        filters.notification_type === "" ||
        notification.notification_type === filters.notification_type;

      const matchesStatus =
        filters.status === "" || notification.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort by created_at in descending order (latest first)
    filtered.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return filtered;
  }, [notifications, filters]);

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if unread
    if (notification.status === "unread") {
      try {
        await updateNotificationMutation.mutateAsync({
          notification_id: notification.id,
          data: {
            notification_type: notification.notification_type,
            description: notification.description,
            status: "read",
          },
        });
        toast.success("Notification marked as read");
      } catch (error) {
        toast.error("Failed to mark notification as read");
      }
    }
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

  const markAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(
        (n) => n.status === "unread"
      );
      await Promise.all(
        unreadNotifications.map((notification) =>
          updateNotificationMutation.mutateAsync({
            notification_id: notification.id,
            data: {
              notification_type: notification.notification_type,
              description: notification.description,
              status: "read",
            },
          })
        )
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
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
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    // Parse the UTC timestamp and convert to local time
    const utcDate = new Date(timestamp + "Z"); // Add 'Z' to ensure UTC parsing
    const localDate = new Date(
      utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
    );

    // Format as date and time
    return localDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const notificationTypeOptions: SelectOption[] = [
    { value: "all", label: "All Types" },
    { value: "low_stock", label: "Low Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "order_created", label: "Order Created" },
    { value: "order_updated", label: "Order Updated" },
    { value: "order_cancelled", label: "Order Cancelled" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "all", label: "All Status" },
    { value: "unread", label: "Unread" },
    { value: "read", label: "Read" },
  ];

  const handleTypeChange = (value: string) => {
    if (value === "all") {
      setFilters((prev) => ({ ...prev, notification_type: "" }));
    } else {
      setFilters((prev) => ({ ...prev, notification_type: value }));
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setFilters((prev) => ({ ...prev, status: "" }));
    } else {
      setFilters((prev) => ({ ...prev, status: value }));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Notifications
            </h1>
            <p className="text-gray-600 mb-4">
              Failed to load notifications. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Manage and view all system notifications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {stats.unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={updateNotificationMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {updateNotificationMutation.isPending
                    ? "Marking..."
                    : "Mark All as Read"}
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🔴</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unread}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(stats.byType).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type
              </label>
              <Select
                value={filters.notification_type || "all"}
                onValueChange={handleTypeChange}
                options={notificationTypeOptions}
                placeholder="Select type"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={filters.status || "all"}
                onValueChange={handleStatusChange}
                options={statusOptions}
                placeholder="Select status"
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() =>
                setFilters({ notification_type: "", status: "", search: "" })
              }
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => handleFilterChange("status", "unread")}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Show Unread Only
            </button>
            <button
              onClick={() =>
                handleFilterChange("notification_type", "low_stock")
              }
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
            >
              Low Stock Alerts
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredNotifications.length} of {stats.total}{" "}
            notifications
          </p>
          <div className="text-sm text-gray-500">
            {stats.unread} unread, {stats.read} read
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-6xl mb-4">🔕</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500 mb-4">
                {filters.search || filters.notification_type || filters.status
                  ? "Try adjusting your filters"
                  : "You're all caught up!"}
              </p>
              {(filters.search ||
                filters.notification_type ||
                filters.status) && (
                <button
                  onClick={() =>
                    setFilters({
                      notification_type: "",
                      status: "",
                      search: "",
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    notification.status === "unread" ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">
                        {getTypeIcon(notification.notification_type)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={`text-lg font-semibold ${
                            notification.status === "unread"
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.notification_type}
                        </h3>
                        <div className="flex items-center space-x-3">
                          {notification.status === "unread" && (
                            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                              Unread
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            {notification.created_at
                              ? formatTimestamp(notification.created_at)
                              : "Unknown time"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 text-base">
                        {notification.description}
                      </p>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded ${getTypeColor(
                            notification.notification_type
                          )}`}
                        >
                          {notification.notification_type}
                        </span>
                        <span className="text-sm text-blue-600 font-medium">
                          Click to mark as read →
                        </span>
                      </div>
                    </div>
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
