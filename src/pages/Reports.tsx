import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  usePurchaseOrderSummary,
  usePurchaseOrders,
} from "../hooks/usePurchaseOrders";
import { useSaleOrderSummary, useSaleOrders } from "../hooks/useSaleOrders";
import { useInventoryTotals, useInventoryItems } from "../hooks/useInventory";
import type { PurchaseOrder, SaleOrder, InventoryItem } from "../services/api";

// Chart color palette
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

// Spending over time chart component
const SpendingOverTimeChart = ({
  purchaseOrders,
}: {
  purchaseOrders: any[];
}) => {
  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No purchase order data available
      </div>
    );
  }

  // Group by date and sum amounts
  const spendingData = purchaseOrders.reduce((acc: any, order: any) => {
    const date = new Date(order.order_date).toLocaleDateString();
    if (acc[date]) {
      acc[date].total += order.total_amount;
    } else {
      acc[date] = { date, total: order.total_amount };
    }
    return acc;
  }, {});

  const chartData = Object.values(spendingData).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Total Spent"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#0088FE"
          strokeWidth={2}
          dot={{ fill: "#0088FE", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Orders per day/month chart component
const OrdersPerTimeChart = ({ purchaseOrders }: { purchaseOrders: any[] }) => {
  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No purchase order data available
      </div>
    );
  }

  // Group by date and count orders
  const ordersData = purchaseOrders.reduce((acc: any, order: any) => {
    const date = new Date(order.order_date).toLocaleDateString();
    if (acc[date]) {
      acc[date].count += 1;
    } else {
      acc[date] = { date, count: 1 };
    }
    return acc;
  }, {});

  const chartData = Object.values(ordersData).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [value, "Orders"]} />
        <Legend />
        <Bar dataKey="count" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Total amount by supplier pie chart component
const SupplierSpendingChart = ({
  purchaseOrders,
}: {
  purchaseOrders: any[];
}) => {
  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No purchase order data available
      </div>
    );
  }

  // Group by supplier and sum amounts
  const supplierData = purchaseOrders.reduce((acc: any, order: any) => {
    if (acc[order.supplier_name]) {
      acc[order.supplier_name] += order.total_amount;
    } else {
      acc[order.supplier_name] = order.total_amount;
    }
    return acc;
  }, {});

  const chartData = Object.entries(supplierData).map(([name, value]) => ({
    name: name.length > 15 ? name.substring(0, 15) + "..." : name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${((percent || 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value}`, "Total Spent"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Sales over time chart component
const SalesOverTimeChart = ({ saleOrders }: { saleOrders: any[] }) => {
  if (!saleOrders || saleOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No sales data available
      </div>
    );
  }

  // Group by date and sum amounts
  const salesData = saleOrders.reduce((acc: any, order: any) => {
    const date = new Date(order.order_date).toLocaleDateString();
    if (acc[date]) {
      acc[date].total += order.total_amount;
    } else {
      acc[date] = { date, total: order.total_amount };
    }
    return acc;
  }, {});

  const chartData = Object.values(salesData).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Total Revenue"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#00C49F"
          strokeWidth={2}
          dot={{ fill: "#00C49F", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Sales per day chart component
const SalesPerTimeChart = ({ saleOrders }: { saleOrders: any[] }) => {
  if (!saleOrders || saleOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No sales data available
      </div>
    );
  }

  // Group by date and count orders
  const salesData = saleOrders.reduce((acc: any, order: any) => {
    const date = new Date(order.order_date).toLocaleDateString();
    if (acc[date]) {
      acc[date].count += 1;
    } else {
      acc[date] = { date, count: 1 };
    }
    return acc;
  }, {});

  const chartData = Object.values(salesData).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [value, "Sales"]} />
        <Legend />
        <Bar dataKey="count" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Inventory value by category chart component
const InventoryValueByCategoryChart = ({
  inventoryItems,
}: {
  inventoryItems: any[];
}) => {
  if (!inventoryItems || inventoryItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No inventory data available
      </div>
    );
  }

  // Group by category and sum values
  const categoryData = inventoryItems.reduce((acc: any, item: any) => {
    if (acc[item.category]) {
      acc[item.category].value += item.price * item.quantity;
      acc[item.category].count += 1;
    } else {
      acc[item.category] = {
        category: item.category,
        value: item.price * item.quantity,
        count: 1,
      };
    }
    return acc;
  }, {});

  const chartData = Object.values(categoryData).sort(
    (a: any, b: any) => b.value - a.value
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, "Total Value"]} />
        <Legend />
        <Bar dataKey="value" fill="#8884D8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export function Reports() {
  const { data: purchaseOrderSummary, isLoading: purchaseOrderLoading } =
    usePurchaseOrderSummary();
  const purchaseOrdersResult = usePurchaseOrders();
  const purchaseOrders = purchaseOrdersResult.data || [];
  const purchaseOrdersLoading = purchaseOrdersResult.isLoading;

  const { data: saleOrderSummary, isLoading: saleOrderLoading } =
    useSaleOrderSummary();

  const saleOrdersResult = useSaleOrders();
  const saleOrders = saleOrdersResult.data || [];
  const saleOrdersLoading = saleOrdersResult.isLoading;

  const { data: inventoryTotals, isLoading: inventoryTotalsLoading } =
    useInventoryTotals();

  const inventoryItemsResult = useInventoryItems();
  const inventoryItems = inventoryItemsResult.data || [];
  const inventoryItemsLoading = inventoryItemsResult.isLoading;

  // Debug logging to see what data is available
  React.useEffect(() => {
    console.log("Reports Data Debug:", {
      purchaseOrders: purchaseOrders.length,
      saleOrders: saleOrders.length,
      inventoryItems: inventoryItems.length,
      inventoryTotals,
      purchaseOrderSummary,
      saleOrderSummary,
    });
  }, [
    purchaseOrders,
    saleOrders,
    inventoryItems,
    inventoryTotals,
    purchaseOrderSummary,
    saleOrderSummary,
  ]);

  // Loading state
  if (
    purchaseOrderLoading ||
    purchaseOrdersLoading ||
    saleOrderLoading ||
    saleOrdersLoading ||
    inventoryTotalsLoading ||
    inventoryItemsLoading
  ) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-lg text-gray-600">
                  Loading reports...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reports & Analytics
              </h1>
              <p className="text-gray-600">
                View detailed insights about your inventory, sales, and
                purchases
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Inventory
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryTotals?.total_quantity || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Inventory Value
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${inventoryTotals?.total_value?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Purchases
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${purchaseOrderSummary?.total_spent?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${saleOrderSummary?.total_revenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Total Spending Over Time
            </h3>
            <SpendingOverTimeChart purchaseOrders={purchaseOrders} />
          </div>

          {/* Orders Per Day/Month */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Orders Per Day
            </h3>
            <OrdersPerTimeChart purchaseOrders={purchaseOrders} />
          </div>

          {/* Supplier Spending - Only show if we have purchase orders with supplier data */}
          {purchaseOrders.length > 0 &&
            purchaseOrders.some((order: any) => order.supplier_name) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Total Amount by Supplier
                </h3>
                <SupplierSpendingChart purchaseOrders={purchaseOrders} />
              </div>
            )}

          {/* Sales Over Time - Only show if we have sales data */}
          {saleOrders.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Sales Revenue Over Time
              </h3>
              <SalesOverTimeChart saleOrders={saleOrders} />
            </div>
          )}

          {/* Sales Per Day - Only show if we have sales data */}
          {saleOrders.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Sales Per Day
              </h3>
              <SalesPerTimeChart saleOrders={saleOrders} />
            </div>
          )}

          {/* Inventory Value by Category - Only show if we have inventory data */}
          {inventoryItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Inventory Value by Category
              </h3>
              <InventoryValueByCategoryChart
                inventoryItems={inventoryItems || []}
              />
            </div>
          )}

          {/* Sales vs Purchases Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Sales vs Purchases
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">
                  Total Revenue
                </span>
                <span className="text-green-700 font-bold text-xl">
                  ${saleOrderSummary?.total_revenue?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-blue-700 font-medium">Total Spent</span>
                <span className="text-blue-700 font-bold text-xl">
                  ${purchaseOrderSummary?.total_spent?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-purple-700 font-medium">Net Profit</span>
                <span
                  className={`font-bold text-xl ${
                    (saleOrderSummary?.total_revenue || 0) -
                      (purchaseOrderSummary?.total_spent || 0) >=
                    0
                      ? "text-purple-700"
                      : "text-red-600"
                  }`}
                >
                  $
                  {(
                    (saleOrderSummary?.total_revenue || 0) -
                    (purchaseOrderSummary?.total_spent || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* No Charts Available Message */}
          {!purchaseOrders.length &&
            !saleOrders.length &&
            !inventoryItems.length && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Data Available for Charts
                </h3>
                <p className="text-gray-600 mb-4">
                  To see charts and analytics, you'll need to:
                </p>
                <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Create some inventory items</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Add purchase orders with items</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Create sale orders with customers</span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
