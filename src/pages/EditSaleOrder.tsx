import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSaleOrder, useInventoryItems } from "../hooks";
import { EditSaleOrderForm } from "../components/EditSaleOrderForm";

export function EditSaleOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log("🚀 EditSaleOrder component rendered with id:", id);

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useSaleOrder(id!);
  const { data: inventoryItems = [], isLoading: inventoryLoading } =
    useInventoryItems();

  console.log("📊 Order data:", {
    order,
    orderLoading,
    orderError,
    inventoryLoading,
  });

  if (orderLoading || inventoryLoading) {
    console.log("⏳ Showing loading state");
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
    console.log("❌ Showing error state:", orderError);
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 text-xl font-semibold mb-2">
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

  console.log("✅ Rendering EditSaleOrderForm with order:", order);
  return (
    <EditSaleOrderForm
      order={order}
      inventoryItems={inventoryItems}
      navigate={navigate}
    />
  );
}
