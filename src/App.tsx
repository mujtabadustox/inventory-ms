import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import Layout from "./Layout";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { InventoryDetails } from "./pages/InventoryDetails";
import { AddItem } from "./pages/AddItem";
import { PurchaseOrders } from "./pages/PurchaseOrders";
import { CreatePurchaseOrder } from "./pages/CreatePurchaseOrder";
import { PurchaseOrderDetails } from "./pages/PurchaseOrderDetails";
import { EditPurchaseOrder } from "./pages/EditPurchaseOrder";
import { SaleOrders } from "./pages/SaleOrders";
import { CreateSaleOrder } from "./pages/CreateSaleOrder";
import { SaleOrderDetails } from "./pages/SaleOrderDetails";
import { Sales } from "./pages/Sales";
import { Purchases } from "./pages/Purchases";
import { Reports } from "./pages/Reports";
import { Notifications } from "./pages/Notifications";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
import { ResetPasswordHandler } from "./components/ResetPasswordHandler";
import { EditSaleOrder } from "./pages/EditSaleOrder";
import { EditInventoryItem } from "./pages/EditInventoryItem";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPasswordHandler />} />

            {/* Root route - home/dashboard */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/add" element={<AddItem />} />
              <Route path="inventory/:id" element={<InventoryDetails />} />
              <Route
                path="inventory/:id/edit"
                element={<EditInventoryItem />}
              />
              <Route path="orders/purchase" element={<PurchaseOrders />} />
              <Route
                path="orders/purchase/create"
                element={<CreatePurchaseOrder />}
              />
              <Route
                path="orders/purchase/:id"
                element={<PurchaseOrderDetails />}
              />
              <Route
                path="orders/purchase/:id/edit"
                element={<EditPurchaseOrder />}
              />
              <Route path="orders/sales" element={<SaleOrders />} />
              <Route path="orders/sales/create" element={<CreateSaleOrder />} />
              <Route path="orders/sales/:id" element={<SaleOrderDetails />} />
              <Route path="orders/sales/:id/edit" element={<EditSaleOrder />} />
              <Route path="purchases" element={<Purchases />} />
              <Route path="sales" element={<Sales />} />
              <Route path="reports" element={<Reports />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
