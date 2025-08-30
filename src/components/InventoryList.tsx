import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { InventoryItem } from "../services/api";
import { ConfirmationDialog } from "./ConfirmationDialog";

// Define the filters interface locally
interface InventoryFilters {
  search: string;
  sortBy: "name" | "price" | "quantity" | "category";
  sortOrder: "asc" | "desc";
  category: string;
}

interface InventoryListProps {
  items: InventoryItem[];
}

export function InventoryList({ items }: InventoryListProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<InventoryFilters>({
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    category: "",
  });

  // Get unique categories from items
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map((item) => item.category))];
    return uniqueCategories.sort();
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch =
        filters.search === "" ||
        item.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "" || item.category === filters.category;

      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "category":
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (filters.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [items, filters]);

  const handleFilterChange = (field: keyof InventoryFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSortChange = (sortBy: InventoryFilters["sortBy"]) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (field: InventoryFilters["sortBy"]) => {
    if (filters.sortBy !== field) return "↕️";
    return filters.sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search items..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label
              htmlFor="sortBy"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort By
            </label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as InventoryFilters["sortBy"])
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort Order
            </label>
            <select
              id="sortOrder"
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/inventory/${item.id}`)}
          >
            {/* Item Image Placeholder */}
            <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>

            {/* Item Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {item.name}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>

              {/* Price and Stock Info */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">
                  ${item.price.toFixed(2)}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span
                    className={`text-sm font-medium ${
                      item.quantity === 0
                        ? "text-red-600"
                        : item.quantity <= item.threshold
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.quantity}
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-3">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    item.quantity === 0
                      ? "bg-red-100 text-red-800"
                      : item.quantity <= item.threshold
                      ? "bg-orange-100 text-orange-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.quantity === 0
                    ? "Out of Stock"
                    : item.quantity <= item.threshold
                    ? "Low Stock"
                    : "In Stock"}
                </span>
              </div>

              {/* View Details Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/inventory/${item.id}`);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.category
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first inventory item."}
          </p>
          {!filters.search && !filters.category && (
            <button
              onClick={() => navigate("/inventory/add")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Item
            </button>
          )}
        </div>
      )}
    </div>
  );
}
