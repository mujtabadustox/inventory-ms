// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Import auth utilities
import { tokenStorage, authService } from "../lib/auth";
import { useAuthStore } from "../stores/authStore";

// Generic API client with JWT support
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Get auth token from Zustand store
    const token = useAuthStore.getState().token;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized (token expired)
      if (response.status === 401) {
        try {
          // Try to refresh token
          const newToken = await authService.refreshToken();

          // Retry request with new token
          const retryConfig: RequestInit = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };

          const retryResponse = await fetch(url, retryConfig);

          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          return await retryResponse.json();
        } catch (refreshError) {
          // Refresh failed, logout user
          authService.logout();
          throw new Error("Authentication failed");
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Create a custom error that preserves the response data
        const error = new Error(`HTTP error! status: ${response.status}`);
        (error as any).response = {
          status: response.status,
          data: errorData,
        };

        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Auth API types
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  access_token: string;
  refresh_token: string;
  new_password: string;
}

// Signup response has nested structure
export interface SignupResponse {
  message: string;
  user: {
    user: {
      id: string;
      email: string;
      role: string;
      user_metadata: {
        email: string;
        email_verified: boolean;
      };
    };
    session: {
      access_token: string;
      refresh_token: string;
    };
  };
}

// Login response has flatter structure
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    role: string;
    user_metadata: {
      email: string;
      email_verified: boolean;
    };
  };
}

// Union type for auth responses
export type AuthResponse = SignupResponse | LoginResponse;

// Auth API functions
export const authApi = {
  // User signup
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiClient.post<SignupResponse>("/auth/signup", data);
  },

  // User login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/auth/login", data);
  },

  // Forgot password
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>("/auth/forgot-password", data);
  },

  // Refresh token
  refreshToken: async (): Promise<{ access_token: string }> => {
    return apiClient.post<{ access_token: string }>("/auth/refresh");
  },

  // Logout - Note: This endpoint might not exist on all backends
  // If it fails, the logout hook will still clear local state
  logout: async (): Promise<void> => {
    return apiClient.post<void>("/auth/logout");
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    return apiClient.post("/auth/reset-password", data);
  },
};

// Example types for inventory management
export interface InventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  threshold: number;
  category: string;
}

// Purchase Order types
export interface PurchaseOrderItem {
  id: number;
  item_id: number;
  quantity: number;
}

export interface PurchaseOrder {
  id: number;
  supplier_name: string;
  phone_number: string;
  email: string;
  total_amount: number;
  order_date: string;
  created_at: string;
  items: PurchaseOrderItem[];
}

export interface CreatePurchaseOrderRequest {
  supplier_name: string;
  supplier_phone: string;
  supplier_email: string;
  order_date: string;
  items: {
    item_id: number;
    quantity: number;
  }[];
}

export interface UpdatePurchaseOrderRequest {
  supplier_name?: string;
  supplier_phone?: string;
  supplier_email?: string;
  order_date?: string;
  items?: {
    item_id: number;
    quantity: number;
  }[];
}

// Sale Order types
export interface SaleOrderItem {
  id: number;
  item_id: number;
  quantity: number;
  sale_price: number | null;
}

export interface SaleOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_date: string;
  total_amount: number;
  items: SaleOrderItem[];
  created_at: string;
}

export interface CreateSaleOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_date: string;
  items: {
    item_id: number;
    quantity: number;
    sale_price: number;
  }[];
}

export interface UpdateSaleOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_date: string;
}

export interface InventoryTotals {
  total_quantity: number;
  total_value: number;
}

export interface PurchaseOrderSummary {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  received_orders: number;
  total_spent: number;
  recent_orders: {
    id: string;
    order_number: string;
    supplier_name: string;
    status: string;
    total_amount: number;
    created_at: string;
  }[];
}

export interface LowStockCount {
  low_stock_count: number;
  out_of_stock_count: number;
}

// Sales summary and top products interfaces
export interface SaleOrderSummary {
  total_sales: number;
  total_revenue: number;
}

export interface TopSellingProduct {
  item_id: number;
  product_name: string;
  total_sold: number;
}

// Notification types
export interface Notification {
  id: string;
  notification_type: string;
  description: string;
  status: "read" | "unread";
  created_at?: string;
}

export interface UpdateNotificationRequest {
  notification_type?: string;
  description?: string;
  status?: "read" | "unread";
}

// Common categories for inventory items
export const INVENTORY_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Automotive",
  "Beauty",
  "Toys",
  "Food & Beverages",
  "Health & Wellness",
] as const;

export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number];

export interface CreateInventoryItemRequest {
  name: string;
  description: string;
  quantity: number;
  price: number;
  threshold: number;
  category: string;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  threshold?: number;
  category?: string;
}

// Example API functions
export const inventoryApi = {
  // Get inventory totals (summary)
  getTotals: async (): Promise<InventoryTotals> => {
    return apiClient.get<InventoryTotals>("/inventory/total");
  },

  // Get low stock count
  getLowStockCount: async (): Promise<LowStockCount> => {
    return apiClient.get<LowStockCount>("/inventory/low_stock");
  },

  // Get all inventory items
  getItems: async (): Promise<InventoryItem[]> => {
    return apiClient.get<InventoryItem[]>("/inventory/");
  },

  // Get a single inventory item
  getItem: async (item_id: string): Promise<InventoryItem> => {
    return apiClient.get<InventoryItem>(`/inventory/${item_id}`);
  },

  // Create a new inventory item
  createItem: async (
    data: CreateInventoryItemRequest
  ): Promise<InventoryItem> => {
    return apiClient.post<InventoryItem>("/inventory/", data);
  },

  // Update an inventory item
  updateItem: async (
    item_id: string,
    data: UpdateInventoryItemRequest
  ): Promise<InventoryItem> => {
    return apiClient.put<InventoryItem>(`/inventory/${item_id}`, data);
  },

  // Delete an inventory item
  deleteItem: async (item_id: string): Promise<void> => {
    return apiClient.delete<void>(`/inventory/${item_id}`);
  },
};

// Purchase Order API functions
export const purchaseOrderApi = {
  // Get all purchase orders
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    return apiClient.get<PurchaseOrder[]>("/purchase-orders/");
  },

  // Get a single purchase order
  getPurchaseOrder: async (order_id: string): Promise<PurchaseOrder> => {
    return apiClient.get<PurchaseOrder>(`/purchase-orders/${order_id}`);
  },

  // Create a new purchase order
  createPurchaseOrder: async (
    data: CreatePurchaseOrderRequest
  ): Promise<PurchaseOrder> => {
    return apiClient.post<PurchaseOrder>("/purchase-orders/", data);
  },

  // Update a purchase order
  updatePurchaseOrder: async (
    order_id: string,
    data: UpdatePurchaseOrderRequest
  ): Promise<PurchaseOrder> => {
    return apiClient.put<PurchaseOrder>(`/purchase-orders/${order_id}`, data);
  },

  // Delete a purchase order
  deletePurchaseOrder: async (order_id: string): Promise<void> => {
    return apiClient.delete<void>(`/purchase-orders/${order_id}`);
  },

  // Get purchase order summary
  getSummary: async (): Promise<PurchaseOrderSummary> => {
    return apiClient.get<PurchaseOrderSummary>("/purchase-orders/summary");
  },
};

// Sale Order API functions
export const saleOrderApi = {
  // Get all sale orders
  getSaleOrders: async (): Promise<SaleOrder[]> => {
    return apiClient.get<SaleOrder[]>("/sale-orders/");
  },

  // Get a single sale order
  getSaleOrder: async (order_id: string): Promise<SaleOrder> => {
    return apiClient.get<SaleOrder>(`/sale-orders/${order_id}`);
  },

  // Create a new sale order
  createSaleOrder: async (data: CreateSaleOrderRequest): Promise<SaleOrder> => {
    return apiClient.post<SaleOrder>("/sale-orders/", data);
  },

  // Update a sale order
  updateSaleOrder: async (
    order_id: string,
    data: UpdateSaleOrderRequest
  ): Promise<SaleOrder> => {
    return apiClient.put<SaleOrder>(`/sale-orders/${order_id}`, data);
  },

  // Delete a sale order
  deleteSaleOrder: async (order_id: string): Promise<void> => {
    return apiClient.delete<void>(`/sale-orders/${order_id}`);
  },

  // Get sales summary
  getSummary: async (): Promise<SaleOrderSummary> => {
    return apiClient.get<SaleOrderSummary>("/sale-orders/summary");
  },

  // Get top selling products
  getTopProducts: async (): Promise<TopSellingProduct[]> => {
    const response = await apiClient.get<{ top_products: TopSellingProduct[] }>(
      "/sale-orders/top-products"
    );
    return response.top_products;
  },
};

// Notification API functions
export const notificationApi = {
  // Get user notifications
  getMyNotifications: async (): Promise<Notification[]> => {
    return apiClient.get<Notification[]>("/notifications/me");
  },

  // Get a single notification
  getNotification: async (notification_id: string): Promise<Notification> => {
    return apiClient.get<Notification>(`/notifications/${notification_id}`);
  },

  // Update notification (mark as read/unread)
  updateNotification: async (
    notification_id: string,
    data: UpdateNotificationRequest
  ): Promise<Notification> => {
    return apiClient.put<Notification>(
      `/notifications/${notification_id}`,
      data
    );
  },

  // Delete a notification
  deleteNotification: async (notification_id: string): Promise<void> => {
    return apiClient.delete<void>(`/notifications/${notification_id}`);
  },
};
