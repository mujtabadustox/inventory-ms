import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSaleOrder } from "../hooks/useSaleOrders";
import { useInventoryItems } from "../hooks/useInventory";
import { Select, type SelectOption } from "../components/ui/Select";
import type { CreateSaleOrderRequest } from "../services/api";
import { toast } from "sonner";

interface SaleOrderItem {
  item_id: number;
  quantity: number;
  sale_price: number;
}

export function CreateSaleOrder() {
  const navigate = useNavigate();
  const createOrderMutation = useCreateSaleOrder();
  const { data: inventoryItems = [], isLoading: inventoryLoading } =
    useInventoryItems();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    order_date: new Date().toISOString().split("T")[0],
  });

  const [orderItems, setOrderItems] = useState<SaleOrderItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);

  // Track input values as strings to allow clearing (like InventoryForm)
  const [inputValues, setInputValues] = useState({
    itemQuantity: "1",
    itemSalePrice: "0",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (
    field: keyof typeof inputValues,
    value: string
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = () => {
    const quantity = parseFloat(inputValues.itemQuantity) || 0;
    const price = parseFloat(inputValues.itemSalePrice) || 0;

    if (!selectedItemId || quantity <= 0) {
      toast.error("Please select an item and enter a valid quantity");
      return;
    }

    if (price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    // Get the selected inventory item to check minimum price and stock
    const selectedInventoryItem = inventoryItems.find(
      (item) => item.id === parseInt(selectedItemId, 10)
    );
    if (!selectedInventoryItem) {
      toast.error("Selected item not found");
      return;
    }

    // Validate that quantity doesn't exceed available stock
    if (quantity > selectedInventoryItem.quantity) {
      toast.error(
        `Quantity (${quantity}) cannot exceed available stock (${selectedInventoryItem.quantity})`
      );
      return;
    }

    // Validate that price is not less than inventory price
    if (price < selectedInventoryItem.price) {
      toast.error(
        `Price cannot be less than $${selectedInventoryItem.price} (inventory price)`
      );
      return;
    }

    // Check if item already exists in order
    const existingItemIndex = orderItems.findIndex(
      (item) => item.item_id === parseInt(selectedItemId, 10)
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity and price
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity = quantity;
      updatedItems[existingItemIndex].sale_price = price;
      setOrderItems(updatedItems);
      toast.success("Item quantity and price updated");
    } else {
      // Add new item
      setOrderItems((prev) => [
        ...prev,
        {
          item_id: parseInt(selectedItemId, 10),
          quantity: quantity,
          sale_price: price,
        },
      ]);
      toast.success("Item added to order");
    }

    // Reset form
    setSelectedItemId("");
    setInputValues({
      itemQuantity: "1",
      itemSalePrice: "0",
    });
  };

  const handleItemSelection = (itemId: number) => {
    setSelectedItemId(itemId.toString());
    // Set the default price to the inventory price when item is selected
    const selectedItem = inventoryItems.find((item) => item.id === itemId);
    if (selectedItem) {
      setInputValues((prev) => ({
        ...prev,
        itemSalePrice: selectedItem.price.toString(),
      }));
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
    toast.success("Item removed from order");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    if (!formData.customer_name.trim()) {
      toast.error("Please enter customer name");
      return;
    }

    if (!formData.customer_email.trim()) {
      toast.error("Please enter customer email");
      return;
    }

    try {
      const createData: CreateSaleOrderRequest = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim(),
        order_date: new Date(formData.order_date).toISOString(),
        items: orderItems.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
          sale_price: item.sale_price,
        })),
      };

      await createOrderMutation.mutateAsync(createData);
      navigate("/orders/sales");
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
      return total + orderItem.sale_price * orderItem.quantity;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const itemOptions = inventoryItems.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  const handleItemSelect = (value: string) => {
    setSelectedItemId(value);
    if (value) {
      const item = inventoryItems.find((item) => item.id.toString() === value);
      if (item) {
        // setSelectedItem(item); // This line was removed as per the edit hint
      }
    } else {
      // setSelectedItem(null); // This line was removed as per the edit hint
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
    <div className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Sale Order
              </h1>
              <p className="text-gray-600">
                Create a new sale order with customer details and items
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
            </div>
          </div>

          {/* Add Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              </div>

              <div>
                <label
                  htmlFor="item_quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Qty
                </label>
                <input
                  type="number"
                  id="item_quantity"
                  value={inputValues.itemQuantity}
                  onChange={(e) =>
                    handleNumberInputChange("itemQuantity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedItemId && (
                  <p className="mt-1 text-sm text-gray-500">
                    Available stock:{" "}
                    {inventoryItems.find(
                      (item) => item.id === parseInt(selectedItemId, 10)
                    )?.quantity || 0}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="item_sale_price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sale Price *
                </label>
                <input
                  type="number"
                  id="item_sale_price"
                  value={inputValues.itemSalePrice}
                  onChange={(e) =>
                    handleNumberInputChange("itemSalePrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {selectedItemId && (
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum price: $
                    {inventoryItems.find(
                      (item) => item.id === parseInt(selectedItemId, 10)
                    )?.price || 0}
                  </p>
                )}
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
                    const itemTotal = orderItem.sale_price * orderItem.quantity;

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
                            ${orderItem.sale_price} each × {orderItem.quantity}{" "}
                            = {formatCurrency(itemTotal)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <label className="block text-xs text-gray-500 mb-1">
                              Quantity
                            </label>
                            <div className="w-20 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700">
                              {orderItem.quantity}
                            </div>
                          </div>
                          <div className="text-center">
                            <label className="block text-xs text-gray-500 mb-1">
                              Sale Price
                            </label>
                            <div className="w-20 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700">
                              ${orderItem.sale_price}
                            </div>
                          </div>
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
                  onClick={() => navigate("/orders/sales")}
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
                    : "Create Sale Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
