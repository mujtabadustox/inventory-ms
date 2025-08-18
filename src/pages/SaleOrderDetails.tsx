import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { SaleOrder } from "../types/orders";
import { dummySaleOrders } from "../data/dummyOrders";

export function SaleOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<SaleOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    // Find the order by ID
    const foundOrder = dummySaleOrders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [id]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    
    setIsUpdatingStatus(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOrder(prev => prev ? {
      ...prev,
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    } : null);
    
    console.log(`Updated order ${order.id} status to ${newStatus}`);
    setIsUpdatingStatus(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Packed': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return '📝';
      case 'Confirmed': return '✅';
      case 'Packed': return '📦';
      case 'Shipped': return '🚚';
      case 'Delivered': return '🎉';
      default: return '📝';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Draft': return 'Confirmed';
      case 'Confirmed': return 'Packed';
      case 'Packed': return 'Shipped';
      case 'Shipped': return 'Delivered';
      default: return null;
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Draft': return 1;
      case 'Confirmed': return 2;
      case 'Packed': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  if (!order) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
            <p className="text-gray-500 mb-4">The sale order you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/orders/sales')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Back to Sale Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sale Order Details</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/orders/sales')}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                ← Back to Orders
              </button>
              {order.status === 'Draft' && (
                <button
                  onClick={() => navigate(`/orders/sales/${order.id}/edit`)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                >
                  Edit Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Status & Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)} {order.status}
              </span>
              <span className="text-sm text-gray-500">
                Step {getStatusStep(order.status)} of 5
              </span>
            </div>
            {getNextStatus(order.status) && (
              <button
                onClick={() => updateOrderStatus(getNextStatus(order.status)!)}
                disabled={isUpdatingStatus}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdatingStatus ? 'Updating...' : `Mark as ${getNextStatus(order.status)}`}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(getStatusStep(order.status) / 5) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <div className="text-center">
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${getStatusStep(order.status) >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span>Draft</span>
              </div>
              <div className="text-center">
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${getStatusStep(order.status) >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span>Confirmed</span>
              </div>
              <div className="text-center">
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${getStatusStep(order.status) >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span>Packed</span>
              </div>
              <div className="text-center">
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${getStatusStep(order.status) >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span>Shipped</span>
              </div>
              <div className="text-center">
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${getStatusStep(order.status) >= 5 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="border-l-2 border-gray-200 pl-6 space-y-4">
            <div className="relative">
              <div className="absolute -left-7 w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Order Created</span> - {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            {order.status !== 'Draft' && (
              <div className="relative">
                <div className="absolute -left-7 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Order Confirmed</span> - {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
            {order.status !== 'Draft' && order.status !== 'Confirmed' && (
              <div className="relative">
                <div className="absolute -left-7 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Order Packed</span> - {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
            {order.status !== 'Draft' && order.status !== 'Confirmed' && order.status !== 'Packed' && (
              <div className="relative">
                <div className="absolute -left-7 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Order Shipped</span> - {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
            {order.status === 'Delivered' && (
              <div className="relative">
                <div className="absolute -left-7 w-4 h-4 bg-green-600 rounded-full"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Order Delivered</span> - {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Name</p>
                <p className="text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-gray-900">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-gray-900">{order.customerAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Order Number</p>
                <p className="text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Order Date</p>
                <p className="text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expected Delivery</p>
                <p className="text-gray-900">{new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Shipping Method</p>
                <p className="text-gray-900">{order.shippingMethod || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Tracking */}
        {order.trackingNumber && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping & Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Tracking Number</p>
                <p className="text-gray-900 font-mono">{order.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Shipping Method</p>
                <p className="text-gray-900">{order.shippingMethod}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${item.totalPrice.toFixed(2)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-3xl font-bold text-gray-900">${order.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm text-gray-900">{new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
