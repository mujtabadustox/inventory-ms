import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { InventoryItem } from "../services/api";
import { INVENTORY_CATEGORIES } from "../services/api";

// Define the form interface to match API payload
interface AddEditItemForm {
  name: string;
  description: string;
  quantity: number;
  price: number;
  threshold: number;
  category: string;
}

interface InventoryFormProps {
  item?: InventoryItem;
  mode: "add" | "edit";
  onSubmit: (data: AddEditItemForm) => void;
  isLoading?: boolean;
  backUrl?: string;
}

export function InventoryForm({
  item,
  mode,
  onSubmit,
  isLoading = false,
  backUrl,
}: InventoryFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddEditItemForm>({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    threshold: 0,
    category: "",
  });

  // Track input values as strings to allow clearing
  const [inputValues, setInputValues] = useState({
    quantity: "0",
    price: "0",
    threshold: "0",
  });

  useEffect(() => {
    if (item && mode === "edit") {
      setFormData({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        threshold: item.threshold,
        category: item.category,
      });
      setInputValues({
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        threshold: item.threshold.toString(),
      });
    }
  }, [item, mode]);

  const handleInputChange = (
    field: keyof AddEditItemForm,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert string inputs to numbers for submission
    const submitData = {
      ...formData,
      quantity: parseFloat(inputValues.quantity) || 0,
      price: parseFloat(inputValues.price) || 0,
      threshold: parseFloat(inputValues.threshold) || 0,
    };

    onSubmit(submitData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header with Back Button */}
      {backUrl && (
        <div className="mb-4">
          <button
            onClick={() => navigate(backUrl)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Details
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === "add" ? "Add New Item" : "Edit Item"}
        </h1>
        <p className="text-gray-600">
          {mode === "add"
            ? "Fill in the details below to add a new inventory item"
            : "Update the item information below"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {INVENTORY_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter item description"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              value={inputValues.price}
              onChange={(e) => handleNumberInputChange("price", e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              value={inputValues.quantity}
              onChange={(e) =>
                handleNumberInputChange("quantity", e.target.value)
              }
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label
              htmlFor="threshold"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Threshold *
            </label>
            <input
              type="number"
              id="threshold"
              value={inputValues.threshold}
              onChange={(e) =>
                handleNumberInputChange("threshold", e.target.value)
              }
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Alert when quantity falls below this number
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(backUrl || "/inventory")}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {mode === "edit" ? "Back to Details" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading
              ? "Saving..."
              : mode === "add"
              ? "Add Item"
              : "Update Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
