import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInventoryItem,
  useDeleteInventoryItem,
} from "../hooks/useInventory";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { toast } from "sonner";

export function InventoryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Use React Query hook to fetch item data
  const { data: item, isLoading, error } = useInventoryItem(id || "");
  const deleteItemMutation = useDeleteInventoryItem();

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Item Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The inventory item you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/inventory")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/inventory/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteItemMutation.mutateAsync(item.id.toString());
      toast.success("Item deleted successfully!");
      navigate("/inventory");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const getStockStatusColor = (quantity: number) => {
    if (quantity === 0) return "text-red-600 bg-red-100";
    if (quantity <= item.threshold) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  const getStockStatusText = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= item.threshold) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/inventory")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Inventory</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
            <p className="text-gray-600 text-lg">{item.category}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Item
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Item
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Item Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Item Image
              </h2>
              <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML =
                          '<div class="w-full h-full flex items-center justify-center"><span class="text-6xl">📦</span></div>';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {item.description || "No description available for this item."}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Item Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">ID</span>
                  <p className="text-gray-900 font-mono">{item.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Category
                  </span>
                  <p className="text-gray-900">{item.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Price
                  </span>
                  <p className="text-gray-900">${item.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Stock
                  </span>
                  <p className="text-gray-900">{item.quantity} units</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Low Stock Threshold
                  </span>
                  <p className="text-gray-900">{item.threshold} units</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Total Value
                  </span>
                  <p className="text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Key Information */}
          <div className="space-y-6">
            {/* Stock Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Stock Status
              </h2>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg border">
                  <div
                    className={`text-3xl font-bold mb-2 ${getStockStatusColor(
                      item.quantity
                    )} px-3 py-1 rounded-full inline-block`}
                  >
                    {item.quantity}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {getStockStatusText(item.quantity)}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unit Price</span>
                    <span className="font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Value</span>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/orders/purchase/create`)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Create Purchase Order
                </button>
                <button
                  onClick={() => navigate(`/orders/sales/create`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Create Sale Order
                </button>
                <button
                  onClick={() => navigate(`/inventory/${id}/edit`)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Update Stock
                </button>
              </div>
            </div>

            {/* Item History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Stock updated 2 days ago</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Purchase order received</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Low stock alert triggered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
