import React from "react";
import { useNavigate } from "react-router-dom";
import { usePurchaseOrderSummary } from "../hooks/usePurchaseOrders";

export function PurchaseOrderSummary() {
  const navigate = useNavigate();
  const { data: summary, isLoading, error } = usePurchaseOrderSummary();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-4">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <p>Failed to load purchase order summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Purchase Orders Summary
        </h2>
        <button
          onClick={() => navigate("/orders/purchase")}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View All →
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-2xl font-bold text-gray-800">
            {summary.total_orders}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="text-2xl font-bold text-amber-700">
            {summary.pending_orders}
          </div>
          <div className="text-sm text-amber-600">Pending</div>
        </div>
        <div className="text-center p-4 bg-sky-50 rounded-lg border border-sky-100">
          <div className="text-2xl font-bold text-sky-700">
            {summary.confirmed_orders}
          </div>
          <div className="text-sm text-sky-600">Confirmed</div>
        </div>
        <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <div className="text-2xl font-bold text-emerald-700">
            {summary.received_orders}
          </div>
          <div className="text-sm text-emerald-600">Received</div>
        </div>
      </div>

      {/* Total Value */}
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
        <div className="text-3xl font-bold text-blue-800">
          ${summary.total_value.toLocaleString()}
        </div>
        <div className="text-sm text-blue-600">Total Purchase Value</div>
      </div>

      {/* Recent Orders */}
      {summary.recent_orders && summary.recent_orders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {summary.recent_orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/orders/purchase/${order.id}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xs">
                      {order.order_number.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {order.supplier_name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Order #{order.order_number}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    ${order.total_amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
