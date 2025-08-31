import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "../services/api";
import { toast } from "sonner";

// Query keys for inventory
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  totals: () => [...inventoryKeys.all, "totals"] as const,
};

// Hook to get inventory totals (summary)
export function useInventoryTotals() {
  return useQuery({
    queryKey: inventoryKeys.totals(),
    queryFn: inventoryApi.getTotals,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get low stock count
export function useLowStockCount() {
  return useQuery({
    queryKey: [...inventoryKeys.all, "lowStockCount"],
    queryFn: inventoryApi.getLowStockCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get all inventory items
export function useInventoryItems() {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: inventoryApi.getItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get a single inventory item
export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryApi.getItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to create a new inventory item
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.createItem,
    onSuccess: () => {
      // Invalidate and refetch inventory list and totals
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.totals() });

      // Invalidate low stock count since new items might affect this
      queryClient.invalidateQueries({
        queryKey: [...inventoryKeys.all, "lowStockCount"],
      });

      // Invalidate sales-related queries since new inventory affects sales data
      queryClient.invalidateQueries({ queryKey: ["sale-orders", "summary"] });
      queryClient.invalidateQueries({
        queryKey: ["sale-orders", "top-products"],
      });

      toast.success("Inventory item created successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to create inventory item:", error);
      toast.error("Failed to create inventory item. Please try again.");
    },
  });
}

// Hook to update an inventory item
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      inventoryApi.updateItem(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch inventory list, specific item, and totals
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.totals() });

      // Invalidate low stock count since quantities might have changed
      queryClient.invalidateQueries({
        queryKey: [...inventoryKeys.all, "lowStockCount"],
      });

      // Invalidate sales-related queries since inventory changes affect sales data
      queryClient.invalidateQueries({ queryKey: ["sale-orders", "summary"] });
      queryClient.invalidateQueries({
        queryKey: ["sale-orders", "top-products"],
      });

      toast.success("Inventory item updated successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to update inventory item:", error);
      toast.error("Failed to update inventory item. Please try again.");
    },
  });
}

// Hook to delete an inventory item
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.deleteItem,
    onSuccess: () => {
      // Invalidate and refetch inventory list and totals
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.totals() });

      // Invalidate low stock count since deleted items affect this
      queryClient.invalidateQueries({
        queryKey: [...inventoryKeys.all, "lowStockCount"],
      });

      // Invalidate sales-related queries since deleted inventory affects sales data
      queryClient.invalidateQueries({ queryKey: ["sale-orders", "summary"] });
      queryClient.invalidateQueries({
        queryKey: ["sale-orders", "top-products"],
      });

      toast.success("Inventory item deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete inventory item:", error);
      toast.error("Failed to delete inventory item. Please try again.");
    },
  });
}
