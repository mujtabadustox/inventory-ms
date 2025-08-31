import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useLowStockCount, useInventoryTotals } from "../hooks/useInventory";
import { usePurchaseOrderSummary } from "../hooks/usePurchaseOrders";
import {
  useSaleOrderSummary,
  useTopSellingProducts,
} from "../hooks/useSaleOrders";

export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: lowStockData, isLoading: lowStockLoading } = useLowStockCount();
  const { data: purchaseOrderSummary, isLoading: purchaseOrderSummaryLoading } =
    usePurchaseOrderSummary();
  const { data: inventoryTotals, isLoading: inventoryTotalsLoading } =
    useInventoryTotals();
  const { data: saleOrderSummary, isLoading: saleOrderSummaryLoading } =
    useSaleOrderSummary();
  const { data: topSellingProducts, isLoading: topSellingLoading } =
    useTopSellingProducts();

  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    // Purchase Order metrics
    const totalPurchaseOrders = purchaseOrderSummary?.total_orders || 0;
    const totalPurchaseAmount = purchaseOrderSummary?.total_spent || 0;
    const pendingPurchaseOrders = purchaseOrderSummary?.pending_orders || 0;
    const confirmedPurchaseOrders = purchaseOrderSummary?.confirmed_orders || 0;
    const receivedPurchaseOrders = purchaseOrderSummary?.received_orders || 0;

    // Sale Order metrics - using real API data
    const totalSaleOrders = saleOrderSummary?.total_sales || 0;
    const totalSaleAmount = saleOrderSummary?.total_revenue || 0;

    // Inventory metrics - using real API data
    const totalItems = inventoryTotals?.total_quantity || 0;
    const totalStockValue = inventoryTotals?.total_value || 0;
    const lowStockItems = lowStockData?.low_stock_count || 0;
    const outOfStockItems = lowStockData?.out_of_stock_count || 0;

    return {
      purchaseOrders: {
        total: totalPurchaseOrders,
        totalAmount: totalPurchaseAmount,
        pending: pendingPurchaseOrders,
        confirmed: confirmedPurchaseOrders,
        received: receivedPurchaseOrders,
      },
      saleOrders: {
        total: totalSaleOrders,
        totalAmount: totalSaleAmount,
      },
      inventory: {
        totalItems,
        totalStockValue,
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
      },
      topSelling: topSellingProducts || [],
    };
  }, [
    lowStockData,
    purchaseOrderSummary,
    inventoryTotals,
    saleOrderSummary,
    topSellingProducts,
  ]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  if (
    purchaseOrderSummaryLoading ||
    inventoryTotalsLoading ||
    lowStockLoading ||
    saleOrderSummaryLoading ||
    topSellingLoading
  ) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
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
                  {metrics.saleOrders.total} sales
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
                  {metrics.inventory.outOfStock} out of stock
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sales Summary</h2>
            <button
              onClick={() => handleCardClick("/orders/sales")}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All Sales →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-800">
                {metrics.saleOrders.total}
              </div>
              <div className="text-green-700 text-sm">Total Sales</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">
                ${metrics.saleOrders.totalAmount.toLocaleString()}
              </div>
              <div className="text-blue-700 text-sm">Total Revenue</div>
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
                {metrics.inventory.lowStock}
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
            <div className="bg-red-100 bg-opacity-80 rounded-lg p-4 border border-red-200">
              <div className="text-3xl font-bold text-red-800">
                {metrics.inventory.totalItems}
              </div>
              <div className="text-red-700 text-sm">Total Items</div>
              <div className="text-red-600 text-xs">In inventory</div>
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
                  key={item.item_id}
                  onClick={() => handleCardClick(`/inventory/${item.item_id}`)}
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
                      {item.product_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.total_sold} units sold
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      #{item.item_id}
                    </div>
                    <div className="text-xs text-gray-500">item ID</div>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleCardClick("/orders/sales")}
              className="flex items-center justify-between p-6 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    View Sales Orders
                  </h3>
                  <p className="text-green-600 text-sm">
                    {metrics.saleOrders.total > 0
                      ? `${metrics.saleOrders.total} order${
                          metrics.saleOrders.total !== 1 ? "s" : ""
                        } • $${metrics.saleOrders.totalAmount.toLocaleString()} revenue`
                      : "No sales orders yet"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 group-hover:text-green-800 text-2xl">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => handleCardClick("/orders/purchase")}
              className="flex items-center justify-between p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    View Purchase Orders
                  </h3>
                  <p className="text-blue-600 text-sm">
                    {metrics.purchaseOrders.total > 0
                      ? `${metrics.purchaseOrders.total} order${
                          metrics.purchaseOrders.total !== 1 ? "s" : ""
                        } • $${metrics.purchaseOrders.totalAmount.toLocaleString()} spent`
                      : "No purchase orders yet"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-blue-600 group-hover:text-blue-800 text-2xl">
                  →
                </span>
              </div>
            </button>

            <button
              onClick={() => handleCardClick("/inventory")}
              className="flex items-center justify-between p-6 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800">
                    Manage Inventory
                  </h3>
                  <p className="text-purple-600 text-sm">
                    {metrics.inventory.totalItems > 0
                      ? `${
                          metrics.inventory.totalItems
                        } items • $${metrics.inventory.totalStockValue.toLocaleString()} value`
                      : "No inventory items yet"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-purple-600 group-hover:text-purple-800 text-2xl">
                  →
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Purchase Orders */}
        {purchaseOrderSummary?.recent_orders &&
          purchaseOrderSummary.recent_orders.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Purchase Orders
                </h2>
                <button
                  onClick={() => handleCardClick("/orders/purchase")}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View All Purchases →
                </button>
              </div>

              <div className="space-y-3">
                {purchaseOrderSummary.recent_orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() =>
                      handleCardClick(`/orders/purchase/${order.id}`)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {order.order_number.slice(-4)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {order.supplier_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Order #{order.order_number}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${order.total_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
