import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  usePurchaseOrder,
  useDeletePurchaseOrder,
} from "../hooks/usePurchaseOrders";
import { useInventoryItems } from "../hooks/useInventory";
import type { PurchaseOrder } from "../services/api";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { toast } from "sonner";

export function PurchaseOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = usePurchaseOrder(id || "");
  const { data: inventoryItems = [] } = useInventoryItems();
  const deleteOrderMutation = useDeletePurchaseOrder();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDeleteOrder = () => {
    if (order) {
      deleteOrderMutation.mutate(order.id.toString(), {
        onSuccess: () => {
          navigate("/orders/purchase");
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getItemDetails = (itemId: number) => {
    const inventoryItem = inventoryItems.find((item) => item.id === itemId);
    return inventoryItem || null;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Loading purchase order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order not found
            </h3>
            <p className="text-gray-500 mb-4">
              The purchase order you're looking for doesn't exist or there was
              an error loading it.
            </p>
            <button
              onClick={() => navigate("/orders/purchase")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Purchase Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Purchase Order Details
              </h1>
              <p className="text-gray-600">
                Order #{order.id} - {order.supplier_name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/orders/purchase/${order.id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Edit Order
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Order
              </button>
              <button
                onClick={() => navigate("/orders/purchase")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Order ID</p>
                <p className="text-2xl font-bold text-gray-900">#{order.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-purple-600">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Supplier Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {order.supplier_name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> {order.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {order.phone_number || "Not provided"}
                </p>
              </div>
            </div>
            <div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {formatDate(order.order_date)}
                </p>
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Items
          </h2>
          {order.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p>No items in this order</p>
            </div>
          ) : (
            <div className="space-y-4">
              {order.items.map((orderItem, index) => {
                const inventoryItem = getItemDetails(orderItem.item_id);
                const itemTotal = inventoryItem
                  ? inventoryItem.price * orderItem.quantity
                  : 0;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {inventoryItem
                            ? inventoryItem.name
                            : `Item #${orderItem.item_id}`}
                        </h4>
                        {inventoryItem && (
                          <div className="mt-1 text-sm text-gray-600">
                            <p>Category: {inventoryItem.category}</p>
                            <p>Description: {inventoryItem.description}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(itemTotal)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(inventoryItem?.price || 0)} each ×{" "}
                          {orderItem.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Order Summary
              </h3>
              <p className="text-sm text-gray-600">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""} •
                Total Quantity:{" "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(order.total_amount)}
              </div>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteOrder}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete purchase order #${order.id} for ${order.supplier_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
