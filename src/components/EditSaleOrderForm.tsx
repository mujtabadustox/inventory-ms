import React, { useState } from "react";
import { useUpdateSaleOrder } from "../hooks/useSaleOrders";
import type {
  SaleOrder,
  InventoryItem,
  UpdateSaleOrderRequest,
} from "../services/api";
import { toast } from "sonner";

interface EditSaleOrderFormProps {
  order: SaleOrder;
  inventoryItems: InventoryItem[];
  navigate: (path: string) => void;
}

export function EditSaleOrderForm({
  order,
  inventoryItems,
  navigate,
}: EditSaleOrderFormProps) {
  const updateOrderMutation = useUpdateSaleOrder();

  // Initialize form data with order data (no useEffect needed)
  const [formData, setFormData] = useState({
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_email: order.customer_email,
    order_date: order.order_date.split("T")[0], // Convert ISO string to date input format
  });

  // Initialize order items with order data (no useEffect needed) - READ ONLY
  const [orderItems] = useState(order.items);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name.trim()) {
      toast.error("Please enter customer name");
      return;
    }

    if (!formData.customer_email.trim()) {
      toast.error("Please enter customer email");
      return;
    }

    try {
      const updateData: UpdateSaleOrderRequest = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim(),
        order_date: new Date(formData.order_date).toISOString(),
      };

      await updateOrderMutation.mutateAsync({
        order_id: order.id.toString(),
        data: updateData,
      });

      navigate("/orders/sales");
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const getItemName = (itemId: number) => {
    const item = inventoryItems.find((invItem) => invItem.id === itemId);
    return item ? item.name : "Unknown Item";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Sale Order
              </h1>
              <p className="text-gray-600">
                Update customer information and order details
              </p>
            </div>
            <button
              onClick={() => navigate("/orders/sales")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Sale Orders
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="customer_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Customer Name *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) =>
                    handleInputChange("customer_name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customer_phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) =>
                    handleInputChange("customer_phone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="customer_email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="customer_email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    handleInputChange("customer_email", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="order_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Order Date
                </label>
                <input
                  type="date"
                  id="order_date"
                  value={formData.order_date}
                  onChange={(e) =>
                    handleInputChange("order_date", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Removed Status field */}
            </div>
          </div>

          {/* Order Items - Read Only */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <p className="text-gray-600 mb-4">
              Order items cannot be modified. Create a new order to change
              items.
            </p>

            {orderItems.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">
                    Order Items ({orderItems.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {orderItems.map((orderItem, index) => {
                    const itemName = getItemName(orderItem.item_id);

                    return (
                      <div
                        key={index}
                        className="px-4 py-3 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {itemName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {orderItem.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Total - REMOVED */}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Total: {formatCurrency(order.total_amount)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/orders/sales")}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateOrderMutation.isPending}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateOrderMutation.isPending
                    ? "Updating..."
                    : "Update Sale Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
