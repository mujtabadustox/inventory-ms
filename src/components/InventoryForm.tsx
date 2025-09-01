import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InventoryItem } from "../services/api";
import { INVENTORY_CATEGORIES } from "../services/api";
import { Select, type SelectOption } from "./ui/Select";

// Define the form interface to match API payload
interface AddEditItemForm {
  name: string;
  description: string;
  quantity: number;
  price: number;
  threshold: number;
  category: string;
  image_url?: string;
}

interface InventoryFormProps {
  item?: InventoryItem;
  mode: "add" | "edit";
  onSubmit: (data: FormData | AddEditItemForm) => void;
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

  // Initialize form data directly from props (no useEffect needed)
  const [formData, setFormData] = useState<AddEditItemForm>(() => {
    if (item && mode === "edit") {
      return {
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        threshold: item.threshold,
        category: item.category,
        image_url: item.image_url || "",
      };
    }
    return {
      name: "",
      description: "",
      quantity: 0,
      price: 0,
      threshold: 0,
      category: "",
      image_url: "",
    };
  });

  // Initialize input values directly from props (no useEffect needed)
  const [inputValues, setInputValues] = useState(() => {
    if (item && mode === "edit") {
      return {
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        threshold: item.threshold.toString(),
      };
    }
    return {
      quantity: "0",
      price: "0",
      threshold: "0",
    };
  });

  // Add image file state
  const [image, setImage] = useState<File | null>(null);

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

  const categoryOptions: SelectOption[] = INVENTORY_CATEGORIES.map(
    (category) => ({
      value: category.toLowerCase(),
      label: category,
    })
  );

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Preview
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
    }
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

    if (mode === "add") {
      // Use FormData for file upload in add mode
      const data = new FormData();
      Object.entries(submitData).forEach(([key, value]) => {
        if (key !== "image_url") data.append(key, value as any);
      });
      if (image) {
        data.append("image", image);
      }
      onSubmit(data);
    } else {
      // Use regular object for edit mode (no image upload)
      const { image_url, ...editData } = submitData;
      onSubmit(editData);
    }
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="Select category"
            />
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

        {/* Image Upload Section - Only show in add mode */}
        {mode === "add" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Image
            </label>
            <div className="space-y-4">
              {/* Image Preview */}
              {formData.image_url ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.image_url}
                    alt="Item preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Selected image</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, image_url: "" }));
                        setImage(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <span className="text-4xl text-gray-400">📷</span>
                  <p className="text-sm text-gray-500 mt-2">
                    No image selected
                  </p>
                  <p className="text-xs text-gray-400">
                    Upload an image file below
                  </p>
                </div>
              )}

              {/* File Upload */}
              <div>
                <label
                  htmlFor="image-upload"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Image File
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Image Display Section - Only show in edit mode */}
        {mode === "edit" && item?.image_url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={item.image_url}
                alt="Current item image"
                className="w-20 h-20 object-cover rounded-lg border border-gray-300"
              />
              <div>
                <p className="text-sm text-gray-600">Current image</p>
                <p className="text-xs text-gray-500">Image cannot be edited</p>
              </div>
            </div>
          </div>
        )}

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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
