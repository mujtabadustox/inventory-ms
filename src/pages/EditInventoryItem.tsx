import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useInventoryItem,
  useUpdateInventoryItem,
} from "../hooks/useInventory";
import { InventoryForm } from "../components/InventoryForm";
import { toast } from "sonner";

export function EditInventoryItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch inventory item data
  const { data: item, isLoading, error } = useInventoryItem(id || "");
  const updateItemMutation = useUpdateInventoryItem();

  // Handle form submission
  const handleSubmit = async (formData: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    threshold: number;
    category: string;
  }) => {
    try {
      await updateItemMutation.mutateAsync({
        id: id!,
        data: formData,
      });
      toast.success("Item updated successfully!");
      navigate(`/inventory/${id}`);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
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

  // Error state
  if (error || !item) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Item Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The inventory item you're trying to edit doesn't exist.
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

  // Render the form with item data passed as props
  return (
    <div className="bg-gray-50 min-h-screen">
      <InventoryForm
        item={item}
        mode="edit"
        onSubmit={handleSubmit}
        isLoading={updateItemMutation.isPending}
        backUrl={`/inventory/${id}`}
      />
    </div>
  );
}
