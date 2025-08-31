import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSaleOrders, useInventoryItems, useDeleteSaleOrder } from "../hooks";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { toast } from "sonner";
import type { InventoryItem } from "../services/api";

interface SaleOrderFilters {
  search: string;
  dateFrom: string;
  dateTo: string;
  sortBy: "order_date" | "customer_name" | "total_amount";
  sortOrder: "asc" | "desc";
}

export function SaleOrders() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, error } = useSaleOrders();
  const { data: inventoryItems = [] } = useInventoryItems();
  const deleteOrderMutation = useDeleteSaleOrder();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    orderId: number | null;
    orderName: string;
  }>({
    isOpen: false,
    orderId: null,
    orderName: "",
  });

  const [filters, setFilters] = useState<SaleOrderFilters>({
    search: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "order_date",
    sortOrder: "desc",
  });

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        filters.search === "" ||
        order.customer_name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        order.customer_email
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesDateFrom =
        filters.dateFrom === "" || order.order_date >= filters.dateFrom;
      const matchesDateTo =
        filters.dateTo === "" || order.order_date <= filters.dateTo;

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
        case "customer_name":
          aValue = a.customer_name.toLowerCase();
          bValue = b.customer_name.toLowerCase();
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

  const handleFilterChange = (field: keyof SaleOrderFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSortChange = (sortBy: SaleOrderFilters["sortBy"]) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
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

  const getItemName = (itemId: number) => {
    const item = inventoryItems.find((invItem) => invItem.id === itemId);
    return item ? item.name : "Unknown Item";
  };

  const openDeleteDialog = (orderId: number, orderName: string) => {
    setDeleteDialog({
      isOpen: true,
      orderId,
      orderName,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      orderId: null,
      orderName: "",
    });
  };

  const handleDeleteOrder = async () => {
    if (!deleteDialog.orderId) return;

    try {
      await deleteOrderMutation.mutateAsync(deleteDialog.orderId.toString());
      toast.success("Sale order deleted successfully");
      closeDeleteDialog();
    } catch (error) {
      toast.error("Failed to delete sale order");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sale orders...</p>
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
            <div className="text-red-600 text-xl font-semibold mb-2">
              Error loading sale orders
            </div>
            <p className="text-gray-600">Please try again later</p>
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
                Sale Orders
              </h1>
              <p className="text-gray-600">Manage your customer sale orders</p>
            </div>
            <button
              onClick={() => navigate("/orders/sales/create")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Sale Order
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    orders.reduce((sum, order) => sum + order.total_amount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.reduce((sum, order) => sum + order.items.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Order # or Customer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) =>
                  handleSortChange(e.target.value as SaleOrderFilters["sortBy"])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="order_date">Order Date</option>
                <option value="customer_name">Customer Name</option>
                <option value="total_amount">Total Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredAndSortedOrders.length} of {orders.length} orders
          </p>
          <div className="text-sm text-gray-500">
            Sort: {filters.sortBy} (
            {filters.sortOrder === "asc" ? "A to Z" : "Z to A"})
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredAndSortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Customer
                        </p>
                        <p className="text-gray-900">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">
                          {order.customer_email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Order Date
                        </p>
                        <p className="text-gray-900">
                          {formatDate(order.order_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Amount
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} items
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-600 mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-900">
                              {getItemName(item.item_id)}
                            </span>
                            <div className="flex items-center space-x-4 text-gray-500">
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col space-y-2">
                    <div className="flex items-center space-x-3 mt-6">
                      <button
                        onClick={() =>
                          navigate(`/orders/sales/${order.id}/edit`)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Edit Order
                      </button>
                      <button
                        onClick={() => navigate(`/orders/sales/${order.id}`)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() =>
                          openDeleteDialog(order.id, order.customer_name)
                        }
                        disabled={deleteOrderMutation.isPending}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {deleteOrderMutation.isPending &&
                        deleteDialog.orderId === order.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sale orders found
            </h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.dateFrom || filters.dateTo
                ? "Try adjusting your filters"
                : "Get started by creating your first sale order"}
            </p>
            {!filters.search && !filters.dateFrom && !filters.dateTo && (
              <button
                onClick={() => navigate("/orders/sales/create")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Create Your First Sale Order
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteOrder}
        title="Delete Sale Order"
        message={`Are you sure you want to delete sale order #${deleteDialog.orderId} for ${deleteDialog.orderName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}
