import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saleOrderApi } from "../services/api";
import type {
  CreateSaleOrderRequest,
  UpdateSaleOrderRequest,
} from "../services/api";
import { toast } from "sonner";

// Query keys for sale orders
export const saleOrderKeys = {
  all: ["sale-orders"] as const,
  lists: () => [...saleOrderKeys.all, "list"] as const,
  list: (filters: string) =>
    [...saleOrderKeys.all, "list", { filters }] as const,
  details: () => [...saleOrderKeys.all, "detail"] as const,
  detail: (id: string) => [...saleOrderKeys.details(), id] as const,
};

// Hook for fetching all sale orders
export function useSaleOrders() {
  return useQuery({
    queryKey: saleOrderKeys.lists(),
    queryFn: saleOrderApi.getSaleOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching a single sale order
export function useSaleOrder(id: string) {
  return useQuery({
    queryKey: saleOrderKeys.detail(id),
    queryFn: () => saleOrderApi.getSaleOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for creating a sale order
export function useCreateSaleOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleOrderApi.createSaleOrder,
    onSuccess: (newOrder) => {
      // Invalidate and refetch sale orders list
      queryClient.invalidateQueries({
        queryKey: saleOrderKeys.lists(),
      });

      // Add the new order to the cache
      queryClient.setQueryData(
        saleOrderKeys.detail(newOrder.id.toString()),
        newOrder
      );

      // Invalidate inventory queries since stock quantities changed
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      // Invalidate inventory totals since stock values changed
      queryClient.invalidateQueries({
        queryKey: ["inventory", "totals"],
      });

      // Invalidate low stock count since quantities changed
      queryClient.invalidateQueries({
        queryKey: ["inventory", "low-stock"],
      });

      // Invalidate sales summary and top products since new order was created
      queryClient.invalidateQueries({
        queryKey: [...saleOrderKeys.all, "summary"],
      });
      queryClient.invalidateQueries({
        queryKey: [...saleOrderKeys.all, "top-products"],
      });

      toast.success("Sale order created successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to create sale order:", error);
      toast.error("Failed to create sale order. Please try again.");
    },
  });
}

// Hook for updating a sale order
export function useUpdateSaleOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      order_id,
      data,
    }: {
      order_id: string;
      data: UpdateSaleOrderRequest;
    }) => saleOrderApi.updateSaleOrder(order_id, data),
    onSuccess: (updatedOrder) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        saleOrderKeys.detail(updatedOrder.id.toString()),
        updatedOrder
      );

      // Invalidate and refetch sale orders list
      queryClient.invalidateQueries({
        queryKey: saleOrderKeys.lists(),
      });

      toast.success("Sale order updated successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to update sale order:", error);
      toast.error("Failed to update sale order. Please try again.");
    },
  });
}

// Hook for deleting a sale order
export function useDeleteSaleOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saleOrderApi.deleteSaleOrder,
    onSuccess: (_, deletedOrderId) => {
      // Remove the deleted order from cache
      queryClient.removeQueries({
        queryKey: saleOrderKeys.detail(deletedOrderId),
      });

      // Invalidate and refetch sale orders list
      queryClient.invalidateQueries({
        queryKey: saleOrderKeys.lists(),
      });

      toast.success("Sale order deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete sale order:", error);
      toast.error("Failed to delete sale order. Please try again.");
    },
  });
}

// Hook for fetching sales summary
export function useSaleOrderSummary() {
  return useQuery({
    queryKey: [...saleOrderKeys.all, "summary"],
    queryFn: saleOrderApi.getSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching top selling products
export function useTopSellingProducts() {
  return useQuery({
    queryKey: [...saleOrderKeys.all, "top-products"],
    queryFn: saleOrderApi.getTopProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
