import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePurchaseOrder } from "../hooks/usePurchaseOrders";
import { useInventoryItems } from "../hooks/useInventory";
import { EditForm } from "../components/EditForm";

export function EditPurchaseOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log("EditPurchaseOrder component rendered");
  console.log("ID from params:", id);

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = usePurchaseOrder(id || "");
  const { data: inventoryItems = [], isLoading: inventoryLoading } =
    useInventoryItems();
  console.log("Order:", order);
  console.log("Order loading:", orderLoading);
  console.log("Order error:", orderError);
  console.log("Inventory items:", inventoryItems);
  console.log("Inventory loading:", inventoryLoading);

  // Show loading state while either order or inventory is loading
  if (orderLoading || inventoryLoading) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if order failed to load or doesn't exist
  if (orderError || !order) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Order not found
            </h3>
            <p className="text-gray-500 mb-4">
              The purchase order you're trying to edit doesn't exist.
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

  // Render the edit form with the order data as props
  return (
    <EditForm
      order={order}
      inventoryItems={inventoryItems}
      navigate={navigate}
    />
  );
}
