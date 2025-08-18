import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InventoryForm } from "../components/InventoryForm";
import type { InventoryItem } from "../data/dummyInventory";
import { dummyInventoryItems } from "../data/dummyInventory";

// Define the form interface locally
interface AddEditItemForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  pictures: string[];
  category: string;
}

export function AddItem() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);

  useEffect(() => {
    if (isEditMode && id) {
      // Load existing item data for editing
      const existingItem = dummyInventoryItems.find(item => item.id === id);
      if (existingItem) {
        setEditingItem(existingItem);
      }
    }
  }, [id, isEditMode]);

  const handleAddItem = async (formData: AddEditItemForm) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isEditMode) {
      // Update existing item
      console.log('Updating item:', { id, ...formData });
    } else {
      // Create new item
      console.log('Adding new item:', formData);
    }
    
    setIsLoading(false);
    navigate('/inventory');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <InventoryForm
        item={editingItem}
        mode={isEditMode ? "edit" : "add"}
        onSubmit={handleAddItem}
        isLoading={isLoading}
        backUrl={isEditMode ? `/inventory/${id}` : undefined}
      />
    </div>
  );
}
