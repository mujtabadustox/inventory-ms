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
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
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

export interface InventoryTotals {
  total_quantity: number;
  total_value: number;
}

export interface LowStockCount {
  low_stock_count: number;
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
    return apiClient.get<LowStockCount>("/inventory/low-stock-count");
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
