import React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { LoginForm } from "./components/LoginForm";
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
import { EditPurchaseOrder } from "./pages/EditPurchaseOrder";
import { EditSaleOrder } from "./pages/EditSaleOrder";
import { Reports } from "./pages/Reports";
import { Notifications } from "./pages/Notifications";
import { useAuthStore } from "./stores/authStore";

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Render the appropriate page content
  const renderPageContent = () => {
    const path = location.pathname;
    console.log("🔍 Processing path:", path);

    // Check for specific order routes first (before dynamic ID routes)
    if (path === "/orders/purchase/create") {
      console.log("✅ Matched: CreatePurchaseOrder");
      return <CreatePurchaseOrder />;
    }

    if (path === "/orders/sales/create") {
      console.log("✅ Matched: CreateSaleOrder");
      return <CreateSaleOrder />;
    }

    // Check for order edit pages - more explicit matching
    if (path.startsWith("/orders/purchase/") && path.endsWith("/edit")) {
      console.log("✅ Matched: EditPurchaseOrder for path:", path);
      return <EditPurchaseOrder />;
    }

    // TEST: Hardcoded route for debugging
    if (path === "/orders/sales/15/edit") {
      console.log("🧪 TEST: Hardcoded route matched for /orders/sales/15/edit");
      return <EditSaleOrder />;
    }

    if (path.startsWith("/orders/sales/") && path.endsWith("/edit")) {
      console.log("✅ Matched: EditSaleOrder for path:", path);
      return <EditSaleOrder />;
    }

    // Check for order details pages (they have dynamic IDs)
    if (
      path.startsWith("/orders/purchase/") &&
      !path.includes("/edit") &&
      !path.includes("/create")
    ) {
      console.log("✅ Matched: PurchaseOrderDetails for path:", path);
      return <PurchaseOrderDetails />;
    }

    if (
      path.startsWith("/orders/sales/") &&
      !path.includes("/edit") &&
      !path.includes("/create")
    ) {
      console.log("✅ Matched: SaleOrderDetails for path:", path);
      return <SaleOrderDetails />;
    }

    // Check for inventory details pages first (they have dynamic IDs)
    if (
      path.startsWith("/inventory/") &&
      !path.includes("/edit") &&
      !path.includes("/add")
    ) {
      console.log("✅ Matched: InventoryDetails for path:", path);
      return <InventoryDetails />;
    }

    // Check for inventory edit pages
    if (path.startsWith("/inventory/") && path.endsWith("/edit")) {
      console.log("✅ Matched: AddItem (inventory edit) for path:", path);
      return <AddItem />;
    }

    console.log("❌ No specific route matched, checking switch cases...");
    switch (path) {
      case "/":
      case "/dashboard":
        console.log("✅ Matched: Dashboard");
        return <Dashboard />;
      case "/inventory":
        console.log("✅ Matched: Inventory");
        return <Inventory />;
      case "/inventory/add":
        console.log("✅ Matched: AddItem");
        return <AddItem />;
      case "/orders/purchase":
        console.log("✅ Matched: PurchaseOrders");
        return <PurchaseOrders />;
      case "/orders/sales":
        console.log("✅ Matched: SaleOrders");
        return <SaleOrders />;
      case "/reports":
        console.log("✅ Matched: Reports");
        return <Reports />;
      case "/notifications":
        console.log("✅ Matched: Notifications");
        return <Notifications />;
      default:
        console.log("❌ No route matched, defaulting to Dashboard");
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{renderPageContent()}</main>
      </div>
    </div>
  );
};

export default Layout;
