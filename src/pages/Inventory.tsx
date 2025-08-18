import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InventoryList } from "../components/InventoryList";
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

export function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>(dummyInventoryItems);

  const handleAddItem = async (formData: AddEditItemForm) => {
    // This function is no longer needed since we're not editing here
    console.log('Add item functionality moved to AddItem page');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-600">
                Manage your product inventory, stock levels, and item details
              </p>
            </div>
            <button
              onClick={() => navigate('/inventory/add')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              + Add New Item
            </button>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter(item => item.stock > 20).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter(item => item.stock <= 20 && item.stock > 5).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(items.map(item => item.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <InventoryList items={items} />
      </div>
    </div>
  );
}



