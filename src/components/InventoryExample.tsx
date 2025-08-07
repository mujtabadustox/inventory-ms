import React, { useState } from "react";
import {
  useInventoryItems,
  useCreateInventoryItem,
  useDeleteInventoryItem,
} from "../hooks/useInventory";
import { useLogout } from "../hooks/useAuth";
import type { CreateInventoryItemRequest } from "../services/api";

export function InventoryExample() {
  const [newItem, setNewItem] = useState<CreateInventoryItemRequest>({
    name: "",
    quantity: 0,
    price: 0,
    category: "",
  });

  // React Query hooks
  const { data: items, isLoading, error, refetch } = useInventoryItems();
  const createItemMutation = useCreateInventoryItem();
  const deleteItemMutation = useDeleteInventoryItem();
  const logoutMutation = useLogout();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItemMutation.mutate(newItem, {
      onSuccess: () => {
        setNewItem({ name: "", quantity: 0, price: 0, category: "" });
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteItemMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="p-4">Loading inventory items...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading inventory: {error.message}
        <button
          onClick={() => refetch()}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Add new item form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: Number(e.target.value) })
              }
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: Number(e.target.value) })
              }
              className="px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createItemMutation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {createItemMutation.isPending ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>

      {/* Inventory list */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Inventory Items</h2>
        </div>
        <div className="divide-y">
          {items?.map((item) => (
            <div
              key={item.id}
              className="px-6 py-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Category: {item.category} | Quantity: {item.quantity} | Price:
                  ${item.price}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleteItemMutation.isPending}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))}
          {items?.length === 0 && (
            <div className="px-6 py-4 text-gray-500">
              No inventory items found.
            </div>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-4 space-y-2">
        {createItemMutation.isError && (
          <div className="text-red-600">
            Error creating item: {createItemMutation.error?.message}
          </div>
        )}
        {deleteItemMutation.isError && (
          <div className="text-red-600">
            Error deleting item: {deleteItemMutation.error?.message}
          </div>
        )}
      </div>
    </div>
  );
}
