import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrderApi } from "../services/api";
import type {
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from "../services/api";
import { toast } from "sonner";

// Query keys for purchase orders
export const purchaseOrderKeys = {
  all: ["purchase-orders"] as const,
  lists: () => [...purchaseOrderKeys.all, "list"] as const,
  list: (filters: string) =>
    [...purchaseOrderKeys.all, "list", { filters }] as const,
  details: () => [...purchaseOrderKeys.all, "detail"] as const,
  detail: (id: string) => [...purchaseOrderKeys.details(), id] as const,
  summary: () => [...purchaseOrderKeys.all, "summary"] as const,
};

// Hook for fetching all purchase orders
export function usePurchaseOrders() {
  return useQuery({
    queryKey: purchaseOrderKeys.lists(),
    queryFn: purchaseOrderApi.getPurchaseOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching a single purchase order
export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: () => purchaseOrderApi.getPurchaseOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching purchase order summary
export function usePurchaseOrderSummary() {
  return useQuery({
    queryKey: purchaseOrderKeys.summary(),
    queryFn: purchaseOrderApi.getSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for summary)
  });
}

// Hook for creating a purchase order
export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseOrderApi.createPurchaseOrder,
    onSuccess: (newOrder) => {
      // Invalidate and refetch purchase orders list
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.lists(),
      });

      // Add the new order to the cache
      queryClient.setQueryData(
        purchaseOrderKeys.detail(newOrder.id.toString()),
        newOrder
      );

      // Invalidate inventory queries since new items might be added
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      // Invalidate inventory totals since stock values might change
      queryClient.invalidateQueries({
        queryKey: ["inventory", "totals"],
      });

      // Invalidate low stock count since quantities might change
      queryClient.invalidateQueries({
        queryKey: ["inventory", "low-stock"],
      });

      // Invalidate purchase order summary since new order was created
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.summary(),
      });

      toast.success("Purchase order created successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to create purchase order:", error);
      toast.error("Failed to create purchase order. Please try again.");
    },
  });
}

// Hook for updating a purchase order
export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      order_id,
      data,
    }: {
      order_id: string;
      data: UpdatePurchaseOrderRequest;
    }) => purchaseOrderApi.updatePurchaseOrder(order_id, data),
    onSuccess: (updatedOrder) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        purchaseOrderKeys.detail(updatedOrder.id.toString()),
        updatedOrder
      );

      // Invalidate and refetch purchase orders list
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.lists(),
      });

      toast.success("Purchase order updated successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to update purchase order:", error);
      toast.error("Failed to update purchase order. Please try again.");
    },
  });
}

// Hook for deleting a purchase order
export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseOrderApi.deletePurchaseOrder,
    onSuccess: (_, deletedOrderId) => {
      // Remove the deleted order from cache
      queryClient.removeQueries({
        queryKey: purchaseOrderKeys.detail(deletedOrderId),
      });

      // Invalidate and refetch purchase orders list
      queryClient.invalidateQueries({
        queryKey: purchaseOrderKeys.lists(),
      });

      toast.success("Purchase order deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete purchase order:", error);
      toast.error("Failed to delete purchase order. Please try again.");
    },
  });
}
