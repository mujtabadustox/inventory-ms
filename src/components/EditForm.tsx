import React, { useState } from "react";
import { useUpdatePurchaseOrder } from "../hooks/usePurchaseOrders";
import type {
  PurchaseOrder,
  UpdatePurchaseOrderRequest,
  InventoryItem,
} from "../services/api";
import { toast } from "sonner";

interface PurchaseOrderItem {
  item_id: number;
  quantity: number;
}

interface EditFormProps {
  order: PurchaseOrder;
  inventoryItems: InventoryItem[];
  navigate: (path: string) => void;
}

export function EditForm({ order, inventoryItems, navigate }: EditFormProps) {
  const updateOrderMutation = useUpdatePurchaseOrder();
  console.log("Order:", order);

  // Initialize form data with the order data passed as props
  const [formData, setFormData] = useState({
    supplier_name: order.supplier_name || "",
    supplier_phone: order.phone_number || "",
    supplier_email: order.email || "",
    order_date: new Date(order.order_date).toISOString().split("T")[0],
  });

  // Keep original order items - they cannot be edited
  const [orderItems] = useState<PurchaseOrderItem[]>(
    order.items.map((item) => ({
      item_id: item.item_id,
      quantity: item.quantity,
    }))
  );

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplier_name.trim()) {
      toast.error("Please enter supplier name");
      return;
    }

    if (!formData.supplier_email.trim()) {
      toast.error("Please enter supplier email");
      return;
    }

    const updateData: UpdatePurchaseOrderRequest = {
      supplier_name: formData.supplier_name.trim(),
      supplier_phone: formData.supplier_phone.trim(),
      supplier_email: formData.supplier_email.trim(),
      order_date: new Date(formData.order_date).toISOString(),
      items: orderItems, // Keep original items unchanged
    };

    try {
      await updateOrderMutation.mutateAsync({
        order_id: order.id.toString(),
        data: updateData,
      });
      navigate(`/orders/purchase/${order.id}`);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const getItemName = (itemId: number) => {
    const item = inventoryItems.find((invItem) => invItem.id === itemId);
    return item ? item.name : "Unknown Item";
  };

  const getItemPrice = (itemId: number) => {
    const item = inventoryItems.find((invItem) => invItem.id === itemId);
    return item ? item.price : 0;
  };

  const calculateTotalAmount = () => {
    return orderItems.reduce((total, orderItem) => {
      const itemPrice = getItemPrice(orderItem.item_id);
      return total + itemPrice * orderItem.quantity;
    }, 0);
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
                Edit Purchase Order
              </h1>
              <p className="text-gray-600">
                Order #{order.id} - {order.supplier_name}
              </p>
            </div>
            <button
              onClick={() => navigate(`/orders/purchase/${order.id}`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Order Details
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supplier Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Supplier Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="supplier_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Supplier Name *
                </label>
                <input
                  type="text"
                  id="supplier_name"
                  value={formData.supplier_name}
                  onChange={(e) =>
                    handleInputChange("supplier_name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="supplier_phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="supplier_phone"
                  value={formData.supplier_phone}
                  onChange={(e) =>
                    handleInputChange("supplier_phone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="supplier_email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="supplier_email"
                  value={formData.supplier_email}
                  onChange={(e) =>
                    handleInputChange("supplier_email", e.target.value)
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
            </div>
          </div>

          {/* Order Items - Read Only */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items (Read Only)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Order items cannot be modified. Only supplier information can be
              edited.
            </p>

            {/* Order Items List */}
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
                    const itemPrice = getItemPrice(orderItem.item_id);
                    const itemTotal = itemPrice * orderItem.quantity;

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
                            ${itemPrice} each × {orderItem.quantity} ={" "}
                            {formatCurrency(itemTotal)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                            Qty: {orderItem.quantity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Total */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">
                      Order Total:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculateTotalAmount())}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Order contains {orderItems.length} item
                  {orderItems.length !== 1 ? "s" : ""} -{" "}
                  {formatCurrency(calculateTotalAmount())}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(`/orders/purchase/${order.id}`)}
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
                    : "Update Purchase Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
