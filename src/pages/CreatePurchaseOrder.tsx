import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePurchaseOrder } from "../hooks/usePurchaseOrders";
import { useInventoryItems } from "../hooks/useInventory";
import { Select, type SelectOption } from "../components/ui/Select";
import type { CreatePurchaseOrderRequest } from "../services/api";
import { toast } from "sonner";

interface PurchaseOrderItem {
  item_id: number;
  quantity: string; // Changed to string to allow empty input
}

export function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const createOrderMutation = useCreatePurchaseOrder();
  const { data: inventoryItems = [], isLoading: inventoryLoading } =
    useInventoryItems();

  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_phone: "",
    supplier_email: "",
    order_date: new Date().toISOString().split("T")[0],
  });

  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<string>("1");

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (value: string) => {
    setItemQuantity(value);
  };

  const handleAddItem = () => {
    if (!selectedItemId || itemQuantity === "" || Number(itemQuantity) <= 0) {
      toast.error("Please select an item and enter a valid quantity");
      return;
    }

    // Check if item already exists in order
    const existingItemIndex = orderItems.findIndex(
      (item) => item.item_id === Number(selectedItemId)
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity = itemQuantity;
      setOrderItems(updatedItems);
      toast.success("Item quantity updated");
    } else {
      // Add new item
      setOrderItems((prev) => [
        ...prev,
        { item_id: Number(selectedItemId), quantity: itemQuantity },
      ]);
      toast.success("Item added to order");
    }

    // Reset form
    setSelectedItemId("");
    setItemQuantity("1");
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
    toast.success("Item removed from order");
  };

  const handleUpdateItemQuantity = (index: number, newQuantity: string) => {
    // Allow empty quantities and 0, don't auto-remove
    setOrderItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    if (!formData.supplier_name.trim()) {
      toast.error("Please enter supplier name");
      return;
    }

    if (!formData.supplier_email.trim()) {
      toast.error("Please enter supplier email");
      return;
    }

    try {
      const createData: CreatePurchaseOrderRequest = {
        supplier_name: formData.supplier_name.trim(),
        supplier_phone: formData.supplier_phone.trim(),
        supplier_email: formData.supplier_email.trim(),
        order_date: new Date(formData.order_date).toISOString(),
        items: orderItems.map((item) => ({
          item_id: item.item_id,
          quantity: Number(item.quantity) || 0,
        })),
      };

      await createOrderMutation.mutateAsync(createData);
      navigate("/orders/purchase");
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
      return total + itemPrice * Number(orderItem.quantity);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const itemOptions: SelectOption[] = inventoryItems.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  const handleItemSelect = (value: string) => {
    setSelectedItemId(value);
    if (value) {
      const item = inventoryItems.find((item) => item.id.toString() === value);
      if (item) {
        setSelectedItem(item);
      }
    } else {
      setSelectedItem(null);
    }
  };

  if (inventoryLoading) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Purchase Order
              </h1>
              <p className="text-gray-600">
                Create a new purchase order with supplier details and items
              </p>
            </div>
            <button
              onClick={() => navigate("/orders/purchase")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Purchase Orders
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

          {/* Add Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Item
                </label>
                <Select
                  value={selectedItemId}
                  onValueChange={handleItemSelect}
                  options={itemOptions}
                  placeholder="Choose an item"
                />
                {selectedItemId && (
                  <div className="mt-2 text-sm text-gray-600">
                    Price: ${getItemPrice(Number(selectedItemId)).toFixed(2)}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="item_quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="item_quantity"
                  value={itemQuantity}
                  onChange={(e) => handleNumberInputChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Item
                </button>
              </div>
            </div>

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
                    const itemTotal = itemPrice * Number(orderItem.quantity);

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
                          <input
                            type="number"
                            value={orderItem.quantity}
                            onChange={(e) =>
                              handleUpdateItemQuantity(index, e.target.value)
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                          >
                            Remove
                          </button>
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
                  {orderItems.length > 0
                    ? `Total: ${orderItems.length} item${
                        orderItems.length !== 1 ? "s" : ""
                      } - ${formatCurrency(calculateTotalAmount())}`
                    : "No items added to order"}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/orders/purchase")}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    orderItems.length === 0 || createOrderMutation.isPending
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrderMutation.isPending
                    ? "Creating..."
                    : "Create Purchase Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
