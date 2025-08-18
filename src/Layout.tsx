import React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { LoginForm } from "./components/LoginForm";
import { NotificationToast } from "./components/NotificationToast";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { AddItem } from "./pages/AddItem";
import { InventoryDetails } from "./pages/InventoryDetails";
import { PurchaseOrders } from "./pages/PurchaseOrders";
import { SaleOrders } from "./pages/SaleOrders";
import { CreatePurchaseOrder } from "./pages/CreatePurchaseOrder";
import { CreateSaleOrder } from "./pages/CreateSaleOrder";
import { PurchaseOrderDetails } from "./pages/PurchaseOrderDetails";
import { SaleOrderDetails } from "./pages/SaleOrderDetails";
import { Reports } from "./pages/Reports";
import { Notifications } from "./pages/Notifications";
import { useAuthStore } from "./stores/authStore";

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Render the appropriate page content
  const renderPageContent = () => {
    const path = location.pathname;

    // Check for inventory details pages first (they have dynamic IDs)
    if (path.match(/^\/inventory\/[^\/]+$/) && !path.includes('/edit') && !path.includes('/add')) {
      return <InventoryDetails />;
    }

    // Check for inventory edit pages
    if (path.match(/^\/inventory\/[^\/]+\/edit$/)) {
      return <AddItem />;
    }

    // Check for specific order routes first (before dynamic ID routes)
    if (path === "/orders/purchase/create") {
      return <CreatePurchaseOrder />;
    }
    
    if (path === "/orders/sales/create") {
      return <CreateSaleOrder />;
    }

    // Check for order edit pages
    if (path.match(/^\/orders\/purchase\/[^\/]+\/edit$/)) {
      return <CreatePurchaseOrder />;
    }
    
    if (path.match(/^\/orders\/sales\/[^\/]+\/edit$/)) {
      return <CreateSaleOrder />;
    }

    // Check for order details pages (they have dynamic IDs)
    if (path.match(/^\/orders\/purchase\/[^\/]+$/) && !path.includes('/edit') && !path.includes('/create')) {
      return <PurchaseOrderDetails />;
    }
    
    if (path.match(/^\/orders\/sales\/[^\/]+$/) && !path.includes('/edit') && !path.includes('/create')) {
      return <SaleOrderDetails />;
    }

    switch (path) {
      case "/":
      case "/dashboard":
        return <Dashboard />;
      case "/inventory":
        return <Inventory />;
      case "/inventory/add":
        return <AddItem />;
      case "/orders/purchase":
        return <PurchaseOrders />;
      case "/orders/sales":
        return <SaleOrders />;
      case "/reports":
        return <Reports />;
      case "/notifications":
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{renderPageContent()}</main>
      </div>

      {/* Notification Toast */}
      <NotificationToast />
    </div>
  );
};

export default Layout;
