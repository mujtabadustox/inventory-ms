import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useLogout } from "../hooks/useAuth";
import { useLowStockCount } from "../hooks/useInventory";
import { dummyPurchaseOrders, dummySaleOrders } from "../data/dummyOrders";
import { dummyInventoryItems } from "../data/dummyInventory";

export function Dashboard() {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { data: lowStockData, isLoading: lowStockLoading } = useLowStockCount();

  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    // Purchase Order metrics
    const totalPurchaseOrders = dummyPurchaseOrders.length;
    const totalPurchaseAmount = dummyPurchaseOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const draftPurchaseOrders = dummyPurchaseOrders.filter(
      (order) => order.status === "Draft"
    ).length;
    const confirmedPurchaseOrders = dummyPurchaseOrders.filter(
      (order) => order.status === "Confirmed"
    ).length;
    const receivedPurchaseOrders = dummyPurchaseOrders.filter(
      (order) => order.status === "Received"
    ).length;

    // Sale Order metrics
    const totalSaleOrders = dummySaleOrders.length;
    const totalSaleAmount = dummySaleOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const draftSaleOrders = dummySaleOrders.filter(
      (order) => order.status === "Draft"
    ).length;
    const confirmedSaleOrders = dummySaleOrders.filter(
      (order) => order.status === "Confirmed"
    ).length;
    const shippedSaleOrders = dummySaleOrders.filter(
      (order) => order.status === "Shipped"
    ).length;
    const deliveredSaleOrders = dummySaleOrders.filter(
      (order) => order.status === "Delivered"
    ).length;

    // Inventory metrics - using real API data for low stock count
    const totalItems = dummyInventoryItems.length;
    const totalStockValue = dummyInventoryItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const lowStockItems = lowStockData?.low_stock_count || 0; // Real API data
    const outOfStockItems = dummyInventoryItems.filter(
      (item) => item.quantity === 0
    );
    const criticalStockItems = dummyInventoryItems.filter(
      (item) => item.quantity <= 5
    );

    // Top selling items (mock data - in real app this would come from sales analytics)
    const topSellingItems = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        sales: 156,
        revenue: 31200,
      },
      { id: "6", name: "Smartphone Case", sales: 89, revenue: 1780 },
      { id: "2", name: "Organic Cotton T-Shirt", sales: 67, revenue: 2009 },
      { id: "9", name: "Denim Jeans", sales: 45, revenue: 3599 },
    ];

    return {
      purchaseOrders: {
        total: totalPurchaseOrders,
        totalAmount: totalPurchaseAmount,
        draft: draftPurchaseOrders,
        confirmed: confirmedPurchaseOrders,
        received: receivedPurchaseOrders,
      },
      saleOrders: {
        total: totalSaleOrders,
        totalAmount: totalSaleAmount,
        draft: draftSaleOrders,
        confirmed: confirmedSaleOrders,
        shipped: shippedSaleOrders,
        delivered: deliveredSaleOrders,
      },
      inventory: {
        totalItems,
        totalStockValue,
        lowStock: lowStockItems,
        outOfStock: outOfStockItems.length,
        critical: criticalStockItems.length,
      },
      topSelling: topSellingItems,
    };
  }, [lowStockData]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Message */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName || user?.name || "User"}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here's your inventory overview and key metrics for today.
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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div
            onClick={() => handleCardClick("/orders/sales")}
            className="bg-white border border-green-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-green-800">
                  ${metrics.saleOrders.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {metrics.saleOrders.total} sale orders
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          {/* Total Spend */}
          <div
            onClick={() => handleCardClick("/orders/purchase")}
            className="bg-white border border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">
                  Total Spend
                </p>
                <p className="text-3xl font-bold text-blue-800">
                  ${metrics.purchaseOrders.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {metrics.purchaseOrders.total} purchase orders
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          {/* Total Items */}
          <div
            onClick={() => handleCardClick("/inventory")}
            className="bg-white border border-purple-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">
                  Total Items
                </p>
                <p className="text-3xl font-bold text-purple-800">
                  {metrics.inventory.totalItems}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  ${metrics.inventory.totalStockValue.toLocaleString()} value
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div
            onClick={() => handleCardClick("/inventory")}
            className="bg-white border border-orange-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">
                  Low Stock Items
                </p>
                <p className="text-3xl font-bold text-orange-800">
                  {metrics.inventory.lowStock}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  {metrics.inventory.critical} critical
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Low Stock Alert Section */}
        <div className="bg-gradient-to-r from-red-200 to-red-300 rounded-xl shadow-lg p-6 text-red-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-full">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Low Stock Alert</h2>
                <p className="text-red-700">Immediate attention required</p>
              </div>
            </div>
            <button
              onClick={() => handleCardClick("/inventory")}
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Manage Inventory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-red-100 bg-opacity-80 rounded-lg p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-800">
                {metrics.inventory.critical}
              </div>
              <div className="text-red-700 text-sm">Critical Stock</div>
              <div className="text-red-600 text-xs">≤5 units remaining</div>
            </div>
            <div className="bg-red-100 bg-opacity-80 rounded-lg p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-800">
                {metrics.inventory.lowStock - metrics.inventory.critical}
              </div>
              <div className="text-red-700 text-sm">Low Stock</div>
              <div className="text-red-600 text-xs">≤10 units remaining</div>
            </div>
            <div className="bg-red-100 bg-opacity-80 rounded-lg p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-800">
                {metrics.inventory.outOfStock}
              </div>
              <div className="text-red-700 text-sm">Out of Stock</div>
              <div className="text-red-600 text-xs">0 units available</div>
            </div>
          </div>

          {/* Low Stock Items List */}
          <div className="bg-red-100 bg-opacity-60 rounded-lg p-4 border border-red-200">
            <h3 className="font-semibold mb-3 text-red-800">
              Critical Items Requiring Attention:
            </h3>
            <div className="space-y-2">
              {dummyInventoryItems
                .filter((item) => item.quantity <= 5)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-red-50 rounded-lg p-3 border border-red-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                        <span className="text-red-700 text-lg">📦</span>
                      </div>
                      <div>
                        <div className="font-medium text-red-800">
                          {item.name}
                        </div>
                        <div className="text-red-600 text-sm">
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-700">
                        {item.quantity}
                      </div>
                      <div className="text-red-600 text-xs">units left</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Top Selling Items & Inventory Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Top Selling Items
              </h2>
              <button
                onClick={() => handleCardClick("/inventory")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {metrics.topSelling.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(`/inventory/${item.id}`)}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group border border-gray-100"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                      index === 0
                        ? "bg-amber-100"
                        : index === 1
                        ? "bg-slate-100"
                        : index === 2
                        ? "bg-orange-100"
                        : "bg-violet-100"
                    }`}
                  >
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : "📦"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.sales} units sold
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      ${item.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Inventory Summary
              </h2>
              <button
                onClick={() => handleCardClick("/inventory")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All →
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Total Items</span>
                <span className="font-semibold text-gray-800">
                  {metrics.inventory.totalItems}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Total Stock Value</span>
                <span className="font-semibold text-gray-800">
                  ${metrics.inventory.totalStockValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                <span className="text-orange-600">Low Stock Items</span>
                <span className="font-semibold text-orange-700">
                  {metrics.inventory.lowStock}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Out of Stock</span>
                <span className="font-semibold text-gray-800">
                  {metrics.inventory.outOfStock}
                </span>
              </div>
            </div>

            {/* Inventory Health Chart */}
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg p-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Inventory Health</div>
                <div className="text-4xl font-bold mb-2">
                  {Math.round(
                    ((metrics.inventory.totalItems -
                      metrics.inventory.lowStock) /
                      metrics.inventory.totalItems) *
                      100
                  )}
                  %
                </div>
                <div className="text-sky-100 text-sm">Items in good stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Overview - Moved to Bottom */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Order Status Overview
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleCardClick("/orders/sales")}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                View All Sales →
              </button>
              <button
                onClick={() => handleCardClick("/orders/purchase")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All Purchases →
              </button>
            </div>
          </div>

          {/* Sale Orders Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-green-700">
              Sale Orders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-gray-800">
                  {metrics.saleOrders.total}
                </div>
                <div className="text-sm text-gray-600">Total Sales</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-2xl font-bold text-amber-700">
                  {metrics.saleOrders.draft}
                </div>
                <div className="text-sm text-amber-600">Draft</div>
              </div>
              <div className="text-center p-4 bg-sky-50 rounded-lg border border-sky-100">
                <div className="text-2xl font-bold text-sky-700">
                  {metrics.saleOrders.confirmed}
                </div>
                <div className="text-sm text-sky-600">Confirmed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">
                  {metrics.saleOrders.shipped}
                </div>
                <div className="text-sm text-blue-600">Shipped</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-700">
                  {metrics.saleOrders.delivered}
                </div>
                <div className="text-sm text-emerald-600">Delivered</div>
              </div>
            </div>
          </div>

          {/* Purchase Orders Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-blue-700">
              Purchase Orders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-gray-800">
                  {metrics.purchaseOrders.total}
                </div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-2xl font-bold text-amber-700">
                  {metrics.purchaseOrders.draft}
                </div>
                <div className="text-sm text-amber-600">Draft</div>
              </div>
              <div className="text-center p-4 bg-sky-50 rounded-lg border border-sky-100">
                <div className="text-2xl font-bold text-sky-700">
                  {metrics.purchaseOrders.confirmed}
                </div>
                <div className="text-sm text-sky-600">Confirmed</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="text-2xl font-bold text-emerald-700">
                  {metrics.purchaseOrders.received}
                </div>
                <div className="text-sm text-emerald-600">Received</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
