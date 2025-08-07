import React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { LoginForm } from "./components/LoginForm";
import { NotificationToast } from "./components/NotificationToast";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Sales } from "./pages/Sales";
import { Purchases } from "./pages/Purchases";
import { Reports } from "./pages/Reports";
import { useAuthStore } from "./stores/authStore";

const Layout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Render the appropriate page content
  const renderPageContent = () => {
    const path = location.pathname;

    switch (path) {
      case "/":
      case "/dashboard":
        return <Dashboard />;
      case "/inventory":
        return <Inventory />;
      case "/sales":
        return <Sales />;
      case "/purchases":
        return <Purchases />;
      case "/reports":
        return <Reports />;
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
