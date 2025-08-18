export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'low_stock' | 'order_update' | 'system' | 'inventory' | 'general';
  isRead: boolean;
  isNew: boolean;
  timestamp: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  category: string;
  type: string;
  isRead: boolean | null;
  search: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  new: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
}

