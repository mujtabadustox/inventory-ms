// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Import auth utilities
import { tokenStorage, authService } from "../lib/auth";

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

    // Get auth token
    const token = tokenStorage.getAccessToken();

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
        throw new Error(`HTTP error! status: ${response.status}`);
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

// Example types for inventory management
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItemRequest {
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  quantity?: number;
  price?: number;
  category?: string;
}

// Example API functions
export const inventoryApi = {
  // Get all inventory items
  getItems: async (): Promise<InventoryItem[]> => {
    return apiClient.get<InventoryItem[]>("/inventory");
  },

  // Get a single inventory item
  getItem: async (id: string): Promise<InventoryItem> => {
    return apiClient.get<InventoryItem>(`/inventory/${id}`);
  },

  // Create a new inventory item
  createItem: async (
    data: CreateInventoryItemRequest
  ): Promise<InventoryItem> => {
    return apiClient.post<InventoryItem>("/inventory", data);
  },

  // Update an inventory item
  updateItem: async (
    id: string,
    data: UpdateInventoryItemRequest
  ): Promise<InventoryItem> => {
    return apiClient.put<InventoryItem>(`/inventory/${id}`, data);
  },

  // Delete an inventory item
  deleteItem: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/inventory/${id}`);
  },
};
