import type { Notification } from '../types/notifications';

export const dummyNotifications: Notification[] = [
  // Low Stock Notifications (High Priority)
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Product "Wireless Headphones" is running low on stock. Current quantity: 3',
    type: 'warning',
    category: 'low_stock',
    isRead: false,
    isNew: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    actionUrl: '/inventory/1',
    metadata: { productId: '1', productName: 'Wireless Headphones', currentStock: 3, threshold: 5 }
  },
  {
    id: '2',
    title: 'Critical Stock Level',
    message: 'Product "Gaming Mouse" has only 1 unit left in stock',
    type: 'error',
    category: 'low_stock',
    isRead: false,
    isNew: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    actionUrl: '/inventory/2',
    metadata: { productId: '2', productName: 'Gaming Mouse', currentStock: 1, threshold: 5 }
  },
  {
    id: '3',
    title: 'Stock Replenishment Needed',
    message: 'Product "USB-C Cable" stock is below recommended level. Current: 8 units',
    type: 'warning',
    category: 'low_stock',
    isRead: true,
    isNew: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actionUrl: '/inventory/3',
    metadata: { productId: '3', productName: 'USB-C Cable', currentStock: 8, threshold: 10 }
  },

  // Order Updates
  {
    id: '4',
    title: 'Purchase Order Confirmed',
    message: 'Purchase Order #PO-2024-001 has been confirmed by supplier',
    type: 'success',
    category: 'order_update',
    isRead: false,
    isNew: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    actionUrl: '/orders/purchase/1',
    metadata: { orderId: '1', orderNumber: 'PO-2024-001', status: 'confirmed' }
  },
  {
    id: '5',
    title: 'Sale Order Shipped',
    message: 'Sale Order #SO-2024-003 has been shipped to customer',
    type: 'info',
    category: 'order_update',
    isRead: true,
    isNew: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    actionUrl: '/orders/sales/3',
    metadata: { orderId: '3', orderNumber: 'SO-2024-003', status: 'shipped' }
  },

  // System Notifications
  {
    id: '6',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2:00 AM. Expected downtime: 30 minutes',
    type: 'info',
    category: 'system',
    isRead: true,
    isNew: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    metadata: { maintenanceTime: '2:00 AM', duration: '30 minutes' }
  },
  {
    id: '7',
    title: 'Backup Completed',
    message: 'Daily database backup completed successfully at 1:00 AM',
    type: 'success',
    category: 'system',
    isRead: true,
    isNew: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    metadata: { backupTime: '1:00 AM', status: 'success' }
  },

  // Inventory Updates
  {
    id: '8',
    title: 'New Product Added',
    message: 'Product "Bluetooth Speaker" has been added to inventory',
    type: 'success',
    category: 'inventory',
    isRead: true,
    isNew: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    actionUrl: '/inventory/4',
    metadata: { productId: '4', productName: 'Bluetooth Speaker' }
  },
  {
    id: '9',
    title: 'Inventory Count Completed',
    message: 'Monthly inventory count has been completed. All items accounted for',
    type: 'info',
    category: 'inventory',
    isRead: true,
    isNew: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    metadata: { countType: 'monthly', status: 'completed' }
  },

  // General Notifications
  {
    id: '10',
    title: 'Welcome to Inventory MS',
    message: 'Thank you for using our inventory management system. Get started by adding your first product',
    type: 'info',
    category: 'general',
    isRead: true,
    isNew: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    actionUrl: '/inventory/add',
    metadata: { type: 'welcome' }
  }
];

export const getNotificationStats = (): NotificationStats => {
  const total = dummyNotifications.length;
  const unread = dummyNotifications.filter(n => !n.isRead).length;
  const newCount = dummyNotifications.filter(n => n.isNew).length;
  
  const byCategory = dummyNotifications.reduce((acc, notification) => {
    acc[notification.category] = (acc[notification.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byType = dummyNotifications.reduce((acc, notification) => {
    acc[notification.type] = (acc[notification.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    unread,
    new: newCount,
    byCategory,
    byType
  };
};

