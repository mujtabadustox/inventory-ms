import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../services/api";
import type { UpdateNotificationRequest } from "../services/api";

// Query keys for notifications
export const notificationKeys = {
  all: ["notifications"] as const,
  myNotifications: () => [...notificationKeys.all, "me"] as const,
  notification: (id: string) => [...notificationKeys.all, id] as const,
};

// Hook for fetching user notifications with real-time updates
export function useMyNotifications() {
  return useQuery({
    queryKey: notificationKeys.myNotifications(),
    queryFn: notificationApi.getMyNotifications,
    refetchInterval: 60000, // Refetch every 1 minute (60,000ms)
    refetchIntervalInBackground: true, // Continue polling even when tab is not active
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

// Hook for fetching a single notification
export function useNotification(id: string) {
  return useQuery({
    queryKey: notificationKeys.notification(id),
    queryFn: () => notificationApi.getNotification(id),
    enabled: !!id, // Only fetch if ID is provided
  });
}

// Hook for updating notification status (read/unread)
export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notification_id,
      data,
    }: {
      notification_id: string;
      data: UpdateNotificationRequest;
    }) => notificationApi.updateNotification(notification_id, data),
    onSuccess: (updatedNotification) => {
      // Update the specific notification in cache
      queryClient.setQueryData(
        notificationKeys.notification(updatedNotification.id),
        updatedNotification
      );

      // Invalidate and refetch notifications list to update unread count
      queryClient.invalidateQueries({
        queryKey: notificationKeys.myNotifications(),
      });
    },
  });
}

// Hook for deleting a notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notification_id: string) =>
      notificationApi.deleteNotification(notification_id),
    onSuccess: (_, notification_id) => {
      // Remove the deleted notification from cache
      queryClient.removeQueries({
        queryKey: notificationKeys.notification(notification_id),
      });

      // Invalidate and refetch notifications list
      queryClient.invalidateQueries({
        queryKey: notificationKeys.myNotifications(),
      });
    },
  });
}

// Hook for getting unread notifications count
export function useUnreadNotificationsCount() {
  const { data: notifications } = useMyNotifications();

  const unreadCount =
    notifications?.filter((notification) => notification.status === "unread")
      .length || 0;

  return {
    unreadCount,
    isLoading: !notifications,
  };
}
