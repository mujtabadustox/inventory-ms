import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSaleOrder, useInventoryItems } from "../hooks";
import { useDeleteSaleOrder } from "../hooks/useSaleOrders";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { toast } from "sonner";

export function SaleOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteOrderMutation = useDeleteSaleOrder();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useSaleOrder(id!);
  const { data: inventoryItems = [], isLoading: inventoryLoading } =
    useInventoryItems();

  const handleDelete = async () => {
    if (!order) return;

    try {
      await deleteOrderMutation.mutateAsync(order.id.toString());
      toast.success("Sale order deleted successfully");
      navigate("/orders/sales");
    } catch (error) {
      toast.error("Failed to delete sale order");
    }
  };

  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const getItemName = (itemId: number) => {
    const item = inventoryItems.find((invItem) => invItem.id === itemId);
    return item ? item.name : "Unknown Item";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (orderLoading || inventoryLoading) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sale order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 text-xl font-semibold mb-4">
              Failed to load sale order
            </div>
            <p className="text-gray-600 mb-6">
              {orderError?.message || "The sale order could not be found."}
            </p>
            <button
              onClick={() => navigate("/orders/sales")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Sale Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sale Order #{order.id}
              </h1>
              <p className="text-gray-600">
                Order details and customer information
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/orders/sales/${order.id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Order
              </button>
              <button
                onClick={openDeleteDialog}
                disabled={deleteOrderMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteOrderMutation.isPending ? "Deleting..." : "Delete Order"}
              </button>
              <button
                onClick={() => navigate("/orders/sales")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Order ID</p>
              <p className="text-lg font-semibold text-gray-900">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Order Date</p>
              <p className="text-gray-900">{formatDate(order.order_date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.customer_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-gray-900">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-gray-900">{order.customer_phone}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-600 mb-3">
            Order Items ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-900">
                  {getItemName(item.item_id)}
                </span>
                <div className="flex items-center space-x-4 text-gray-500">
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(order.total_amount)}
              </p>
              <p className="text-sm text-gray-500">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-sm text-gray-900">
                {order.created_at ? formatDate(order.created_at) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Sale Order"
        message={`Are you sure you want to delete sale order #${order.id} for ${order.customer_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
