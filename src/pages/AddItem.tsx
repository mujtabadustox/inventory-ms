import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InventoryForm } from "../components/InventoryForm";
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useInventoryItem,
} from "../hooks/useInventory";

export function AddItem() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Use React Query hooks for API operations
  const createItemMutation = useCreateInventoryItem();
  const updateItemMutation = useUpdateInventoryItem();
  const { data: existingItem } = useInventoryItem(id || "");

  const handleAddItem = async (formData: any) => {
    try {
      if (isEditMode && id) {
        // Update existing item
        await updateItemMutation.mutateAsync({ id, data: formData });
        // Toast is handled by the hook
      } else {
        // Create new item
        await createItemMutation.mutateAsync(formData);
        // Toast is handled by the hook
      }
      navigate("/inventory");
    } catch (error) {
      console.error("Error saving item:", error);
      // Error toast is handled by the hook
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <InventoryForm
        item={existingItem}
        mode={isEditMode ? "edit" : "add"}
        onSubmit={handleAddItem}
        isLoading={createItemMutation.isPending || updateItemMutation.isPending}
        backUrl={isEditMode ? `/inventory/${id}` : undefined}
      />
    </div>
  );
}
