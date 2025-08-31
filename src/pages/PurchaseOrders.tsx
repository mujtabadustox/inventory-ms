import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePurchaseOrders,
  useDeletePurchaseOrder,
} from "../hooks/usePurchaseOrders";
import type { PurchaseOrder } from "../services/api";
import { ConfirmationDialog } from "../components/ConfirmationDialog";

interface OrderFilters {
  search: string;
  dateFrom: string;
  dateTo: string;
  sortBy: "order_date" | "total_amount" | "supplier_name";
  sortOrder: "asc" | "desc";
}

export function PurchaseOrders() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "order_date",
    sortOrder: "desc",
  });

  // Fetch purchase orders with real API data
  const { data: orders = [], isLoading, error } = usePurchaseOrders();
  const deleteOrderMutation = useDeletePurchaseOrder();
  const [orderToDelete, setOrderToDelete] = useState<PurchaseOrder | null>(
    null
  );

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        filters.search === "" ||
        order.supplier_name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        order.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDateFrom =
        filters.dateFrom === "" ||
        new Date(order.order_date) >= new Date(filters.dateFrom);
      const matchesDateTo =
        filters.dateTo === "" ||
        new Date(order.order_date) <= new Date(filters.dateTo);

      return matchesSearch && matchesDateFrom && matchesDateTo;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case "order_date":
          aValue = new Date(a.order_date).getTime();
          bValue = new Date(b.order_date).getTime();
          break;
        case "supplier_name":
          aValue = a.supplier_name.toLowerCase();
          bValue = b.supplier_name.toLowerCase();
          break;
        case "total_amount":
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        default:
          aValue = new Date(a.order_date).getTime();
          bValue = new Date(b.order_date).getTime();
      }

      if (filters.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [orders, filters]);

  const handleFilterChange = (field: keyof OrderFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (sortBy: OrderFilters["sortBy"]) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteOrder = (order: PurchaseOrder) => {
    setOrderToDelete(order);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrderMutation.mutate(orderToDelete.id.toString());
      setOrderToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate totals
  const totalSpend = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading purchase orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Purchase Orders
            </h2>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Purchase Orders
              </h1>
              <p className="text-gray-600">
                Manage and track all your purchase orders
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/orders/purchase/create")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Purchase Order
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spend</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalSpend)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-purple-600">
                  {totalItems}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search suppliers or emails..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  dateFrom: "",
                  dateTo: "",
                  sortBy: "order_date",
                  sortOrder: "desc",
                })
              }
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Purchase Orders ({filteredAndSortedOrders.length})
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <button
                  onClick={() => handleSortChange("order_date")}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filters.sortBy === "order_date"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Date{" "}
                  {filters.sortBy === "order_date" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSortChange("supplier_name")}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filters.sortBy === "supplier_name"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Supplier{" "}
                  {filters.sortBy === "supplier_name" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSortChange("total_amount")}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filters.sortBy === "total_amount"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Amount{" "}
                  {filters.sortBy === "total_amount" &&
                    (filters.sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          </div>

          {filteredAndSortedOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No purchase orders found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or create your first purchase order
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAndSortedOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-lg">📋</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {order.supplier_name}
                            </h3>
                            <span className="text-2xl font-bold text-blue-600">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              {order.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span>{" "}
                              {order.phone_number}
                            </div>
                            <div>
                              <span className="font-medium">Order Date:</span>{" "}
                              {formatDate(order.order_date)}
                            </div>
                          </div>

                          <div className="mt-3">
                            <span className="text-sm font-medium text-gray-600">
                              Items:{" "}
                            </span>
                            <span className="text-sm text-gray-800">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}(
                              {order.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}{" "}
                              total quantity)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/orders/purchase/${order.id}`)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/orders/purchase/${order.id}/edit`)
                      }
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(order)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete the purchase order for ${orderToDelete?.supplier_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
