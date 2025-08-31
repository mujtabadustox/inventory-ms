export { useAuthStore } from "../stores/authStore";
export { useAppStore } from "../stores/appStore";
export { useInventoryStore } from "../stores/inventoryStore";

// Auth hooks
export {
  useLogin,
  useSignup,
  useLogout,
  useForgotPassword,
  useResetPassword,
} from "./useAuth";

// Inventory hooks
export {
  useInventoryItems,
  useInventoryItem,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useInventoryTotals,
  useLowStockCount,
} from "./useInventory";

// Purchase Order hooks
export {
  usePurchaseOrders,
  usePurchaseOrder,
  usePurchaseOrderSummary,
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useDeletePurchaseOrder,
} from "./usePurchaseOrders";

// Sale Order hooks
export {
  useSaleOrders,
  useSaleOrder,
  useCreateSaleOrder,
  useUpdateSaleOrder,
  useDeleteSaleOrder,
  useSaleOrderSummary,
  useTopSellingProducts,
} from "./useSaleOrders";

// Notification hooks
export {
  useMyNotifications,
  useNotification,
  useUpdateNotification,
  useDeleteNotification,
  useUnreadNotificationsCount,
} from "./useNotifications";
