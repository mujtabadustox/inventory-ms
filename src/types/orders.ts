// Purchase Order Types
export type PurchaseOrderStatus = 'Draft' | 'Confirmed' | 'Received';

export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Sale Order Types
export type SaleOrderStatus = 'Draft' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';

export interface SaleOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SaleOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: SaleOrderStatus;
  items: SaleOrderItem[];
  totalAmount: number;
  shippingMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Common Filter Types
export interface OrderFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'orderDate' | 'orderNumber' | 'totalAmount' | 'status';
  sortOrder: 'asc' | 'desc';
}

// Form Types
export interface CreatePurchaseOrderForm {
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  expectedDeliveryDate: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  notes?: string;
}

export interface CreateSaleOrderForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  expectedDeliveryDate: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  shippingMethod?: string;
  notes?: string;
}
