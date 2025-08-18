import type { PurchaseOrder, SaleOrder } from '../types/orders';

// Dummy Purchase Orders
export const dummyPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    orderNumber: "PO-2024-001",
    supplierName: "Tech Supplies Co.",
    supplierEmail: "orders@techsupplies.com",
    supplierPhone: "+1-555-0123",
    orderDate: "2024-01-15",
    expectedDeliveryDate: "2024-01-25",
    status: "Confirmed",
    items: [
      {
        id: "POI-001",
        itemId: "1",
        itemName: "Wireless Bluetooth Headphones",
        quantity: 50,
        unitPrice: 150.00,
        totalPrice: 7500.00
      },
      {
        id: "POI-002",
        itemId: "6",
        itemName: "Smartphone Case",
        quantity: 100,
        unitPrice: 12.00,
        totalPrice: 1200.00
      }
    ],
    totalAmount: 8700.00,
    notes: "Priority order for Q1 inventory",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "PO-002",
    orderNumber: "PO-2024-002",
    supplierName: "Fashion Wholesale Ltd.",
    supplierEmail: "orders@fashionwholesale.com",
    supplierPhone: "+1-555-0124",
    orderDate: "2024-01-10",
    expectedDeliveryDate: "2024-01-30",
    status: "Draft",
    items: [
      {
        id: "POI-003",
        itemId: "2",
        itemName: "Organic Cotton T-Shirt",
        quantity: 200,
        unitPrice: 18.00,
        totalPrice: 3600.00
      },
      {
        id: "POI-004",
        itemId: "9",
        itemName: "Denim Jeans",
        quantity: 150,
        unitPrice: 45.00,
        totalPrice: 6750.00
      }
    ],
    totalAmount: 10350.00,
    notes: "Spring collection items",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "PO-003",
    orderNumber: "PO-2024-003",
    supplierName: "Home & Garden Supplies",
    supplierEmail: "orders@homegarden.com",
    supplierPhone: "+1-555-0125",
    orderDate: "2024-01-05",
    expectedDeliveryDate: "2024-01-20",
    status: "Received",
    items: [
      {
        id: "POI-005",
        itemId: "3",
        itemName: "Stainless Steel Water Bottle",
        quantity: 75,
        unitPrice: 18.00,
        totalPrice: 1350.00
      },
      {
        id: "POI-006",
        itemId: "11",
        itemName: "Plant Pot Set",
        quantity: 50,
        unitPrice: 25.00,
        totalPrice: 1250.00
      }
    ],
    totalAmount: 2600.00,
    notes: "Delivered on time",
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-20T16:45:00Z"
  }
];

// Dummy Sale Orders
export const dummySaleOrders: SaleOrder[] = [
  {
    id: "SO-001",
    orderNumber: "SO-2024-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1-555-1001",
    customerAddress: "123 Main St, City, State 12345",
    orderDate: "2024-01-16",
    expectedDeliveryDate: "2024-01-23",
    status: "Delivered",
    items: [
      {
        id: "SOI-001",
        itemId: "1",
        itemName: "Wireless Bluetooth Headphones",
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99
      }
    ],
    totalAmount: 199.99,
    shippingMethod: "Express",
    trackingNumber: "TRK-123456789",
    notes: "Customer requested signature confirmation",
    createdAt: "2024-01-16T11:20:00Z",
    updatedAt: "2024-01-23T14:30:00Z"
  },
  {
    id: "SO-002",
    orderNumber: "SO-2024-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+1-555-1002",
    customerAddress: "456 Oak Ave, Town, State 67890",
    orderDate: "2024-01-17",
    expectedDeliveryDate: "2024-01-24",
    status: "Shipped",
    items: [
      {
        id: "SOI-002",
        itemId: "5",
        itemName: "Yoga Mat Premium",
        quantity: 1,
        unitPrice: 49.99,
        totalPrice: 49.99
      },
      {
        id: "SOI-003",
        itemId: "7",
        itemName: "Running Shoes",
        quantity: 1,
        unitPrice: 129.99,
        totalPrice: 129.99
      }
    ],
    totalAmount: 179.98,
    shippingMethod: "Standard",
    trackingNumber: "TRK-987654321",
    notes: "Gift items",
    createdAt: "2024-01-17T15:45:00Z",
    updatedAt: "2024-01-22T10:15:00Z"
  },
  {
    id: "SO-003",
    orderNumber: "SO-2024-003",
    customerName: "Mike Davis",
    customerEmail: "mike.davis@email.com",
    customerPhone: "+1-555-1003",
    customerAddress: "789 Pine Rd, Village, State 11111",
    orderDate: "2024-01-18",
    expectedDeliveryDate: "2024-01-25",
    status: "Packed",
    items: [
      {
        id: "SOI-004",
        itemId: "4",
        itemName: "LED Desk Lamp",
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99
      },
      {
        id: "SOI-005",
        itemId: "10",
        itemName: "Gaming Mouse",
        quantity: 1,
        unitPrice: 69.99,
        totalPrice: 69.99
      }
    ],
    totalAmount: 159.98,
    shippingMethod: "Standard",
    notes: "Office setup items",
    createdAt: "2024-01-18T13:10:00Z",
    updatedAt: "2024-01-21T16:20:00Z"
  },
  {
    id: "SO-004",
    orderNumber: "SO-2024-004",
    customerName: "Lisa Wilson",
    customerEmail: "lisa.wilson@email.com",
    customerPhone: "+1-555-1004",
    customerAddress: "321 Elm St, Borough, State 22222",
    orderDate: "2024-01-19",
    expectedDeliveryDate: "2024-01-26",
    status: "Confirmed",
    items: [
      {
        id: "SOI-006",
        itemId: "8",
        itemName: "Coffee Maker",
        quantity: 1,
        unitPrice: 149.99,
        totalPrice: 149.99
      }
    ],
    totalAmount: 149.99,
    shippingMethod: "Standard",
    notes: "Kitchen appliance",
    createdAt: "2024-01-19T09:30:00Z",
    updatedAt: "2024-01-19T09:30:00Z"
  },
  {
    id: "SO-005",
    orderNumber: "SO-2024-005",
    customerName: "David Brown",
    customerEmail: "david.brown@email.com",
    customerPhone: "+1-555-1005",
    customerAddress: "654 Maple Dr, County, State 33333",
    orderDate: "2024-01-20",
    expectedDeliveryDate: "2024-01-27",
    status: "Draft",
    items: [
      {
        id: "SOI-007",
        itemId: "12",
        itemName: "Fitness Tracker",
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99
      }
    ],
    totalAmount: 89.99,
    shippingMethod: "Standard",
    notes: "Health and fitness",
    createdAt: "2024-01-20T16:45:00Z",
    updatedAt: "2024-01-20T16:45:00Z"
  }
];

// Status options for filters
export const purchaseOrderStatuses = ['Draft', 'Confirmed', 'Received'];
export const saleOrderStatuses = ['Draft', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
