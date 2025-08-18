import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyInventoryItems } from "../data/dummyInventory";
import type { InventoryItem } from "../data/dummyInventory";

export function InventoryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the inventory item by ID
  const item = dummyInventoryItems.find(item => item.id === id);
  
  if (!item) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
            <p className="text-gray-600 mb-4">The inventory item you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/inventory')}
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
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      // In a real app, this would call an API to delete the item
      console.log('Deleting item:', item.id);
      navigate('/inventory');
    }
  };

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "text-red-600 bg-red-100";
    if (stock <= 5) return "text-orange-600 bg-orange-100";
    if (stock <= 10) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getStockStatusText = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Critical Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/inventory')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Image</h2>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {item.description || "No description available for this item."}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">ID</span>
                  <p className="text-gray-900 font-mono">{item.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <p className="text-gray-900">{item.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Price</span>
                  <p className="text-gray-900">${item.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Stock</span>
                  <p className="text-gray-900">{item.stock} units</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Key Information */}
          <div className="space-y-6">
            {/* Stock Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock Status</h2>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg border">
                  <div className={`text-3xl font-bold mb-2 ${getStockStatusColor(item.stock)} px-3 py-1 rounded-full inline-block`}>
                    {item.stock}
                  </div>
                  <p className="text-gray-600 text-sm">{getStockStatusText(item.stock)}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unit Price</span>
                    <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Value</span>
                    <span className="font-semibold text-gray-900">${(item.price * item.stock).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
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
    </div>
  );
}
