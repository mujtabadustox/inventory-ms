import React from "react";
import { useAuthStore } from "../stores/authStore";
import { useLogout } from "../hooks/useAuth";

export function Dashboard() {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.firstName || user?.name || "User"}! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your inventory today.
              </p>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Test Logout
            </button>
          </div>
        </div>
        {/* Sales Activity Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales Activity
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">228</div>
              <div className="text-sm text-gray-600">Qty</div>
              <div className="text-xs text-gray-500">TO BE PACKED</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">6</div>
              <div className="text-sm text-gray-600">Pkgs</div>
              <div className="text-xs text-gray-500">TO BE SHIPPED</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">10</div>
              <div className="text-sm text-gray-600">Pkgs</div>
              <div className="text-xs text-gray-500">TO BE DELIVERED</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">474</div>
              <div className="text-sm text-gray-600">Qty</div>
              <div className="text-xs text-gray-500">TO BE INVOICED</div>
            </div>
          </div>
        </div>

        {/* Inventory Summary Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Inventory Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">QUANTITY IN HAND</div>
              <div className="text-2xl font-bold text-gray-800">10,458</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">
                QUANTITY TO BE RECEIVED
              </div>
              <div className="text-2xl font-bold text-gray-800">168</div>
            </div>
          </div>
        </div>

        {/* Product Details and Top Selling Items Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              PRODUCT DETAILS
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">All Item Group</span>
                <span className="font-semibold text-gray-800">39</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">All Items</span>
                <span className="font-semibold text-gray-800">190</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unconfirmed Items</span>
                <span className="font-semibold text-gray-800">121</span>
              </div>
            </div>

            {/* Active Items Chart */}
            <div className="mt-6 flex items-center justify-center">
              <div className="relative w-24 h-24">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="71, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">71%</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-600">Active Items</div>
              </div>
            </div>
          </div>

          {/* Top Selling Items Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              TOP SELLING ITEMS
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-lg">🧥</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Hanswooly Cotton Cas...
                  </div>
                  <div className="text-sm text-gray-600">171 pcs</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">👕</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Cutiepie Rompers-spo.
                  </div>
                  <div className="text-sm text-gray-600">45 sets</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
