import { useApiQuery, useApiMutation, useInvalidateQueries } from "./useApi";
import {
  inventoryApi,
  type InventoryItem,
  type CreateInventoryItemRequest,
  type UpdateInventoryItemRequest,
} from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

// Query keys for better cache management
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

// Hook to get all inventory items
export function useInventoryItems() {
  return useApiQuery(inventoryKeys.lists(), inventoryApi.getItems, {
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook to get a single inventory item
export function useInventoryItem(id: string) {
  return useApiQuery(inventoryKeys.detail(id), () => inventoryApi.getItem(id), {
    enabled: !!id, // Only run query if id exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to create a new inventory item
export function useCreateInventoryItem() {
  const { invalidateQueries } = useInvalidateQueries();

  return useApiMutation(inventoryApi.createItem, {
    onSuccess: () => {
      // Invalidate and refetch inventory lists
      invalidateQueries(inventoryKeys.lists());
    },
    onError: (error: any) => {
      console.error("Failed to create inventory item:", error);
    },
  });
}

// Hook to update an inventory item
export function useUpdateInventoryItem() {
  const { invalidateQueries } = useInvalidateQueries();

  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateInventoryItemRequest }) =>
      inventoryApi.updateItem(id, data),
    {
      onSuccess: (_: any, { id }: { id: string }) => {
        // Invalidate specific item and lists
        invalidateQueries(inventoryKeys.detail(id));
        invalidateQueries(inventoryKeys.lists());
      },
      onError: (error: any) => {
        console.error("Failed to update inventory item:", error);
      },
    }
  );
}

// Hook to delete an inventory item
export function useDeleteInventoryItem() {
  const { invalidateQueries } = useInvalidateQueries();

  return useApiMutation(inventoryApi.deleteItem, {
    onSuccess: () => {
      // Invalidate and refetch inventory lists
      invalidateQueries(inventoryKeys.lists());
    },
    onError: (error: any) => {
      console.error("Failed to delete inventory item:", error);
    },
  });
}

// Hook to get inventory items with optimistic updates
export function useInventoryItemsWithOptimistic() {
  const queryClient = useQueryClient();

  const { invalidateQueries } = useInvalidateQueries();

  const createMutation = useApiMutation(inventoryApi.createItem, {
    onMutate: async (newItem) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: inventoryKeys.lists() });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<InventoryItem[]>(
        inventoryKeys.lists()
      );

      // Optimistically update to the new value
      queryClient.setQueryData<InventoryItem[]>(
        inventoryKeys.lists(),
        (old) => {
          const optimisticItem: InventoryItem = {
            id: `temp-${Date.now()}`,
            ...newItem,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return old ? [...old, optimisticItem] : [optimisticItem];
        }
      );

      // Return a context object with the snapshotted value
      return { previousItems };
    },
    onError: (err: any, newItem: any, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousItems) {
        queryClient.setQueryData(inventoryKeys.lists(), context.previousItems);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      invalidateQueries(inventoryKeys.lists());
    },
  });

  return {
    ...useInventoryItems(),
    createItem: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
