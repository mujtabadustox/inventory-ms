import React from "react";
import { useAppStore, useAuthStore, useInventoryStore } from "../stores";

export function ExampleUsage() {
  // App Store - UI State
  const {
    sidebarCollapsed,
    toggleSidebar,
    addNotification,
    globalLoading,
    setGlobalLoading,
  } = useAppStore();

  // Auth Store - User State
  const { user, isAuthenticated, login, logout, hasPermission } =
    useAuthStore();

  // Inventory Store - Domain State
  const { filters, setFilters, selectedItems, toggleItemSelection } =
    useInventoryStore();

  const handleLogin = () => {
    // Simulate login
    login(
      {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
      },
      "fake-jwt-token"
    );

    addNotification({
      type: "success",
      title: "Login Successful",
      message: "Welcome back!",
    });
  };

  const handleLogout = () => {
    logout();
    addNotification({
      type: "info",
      title: "Logged Out",
      message: "You have been logged out successfully",
    });
  };

  const handleBulkAction = () => {
    if (selectedItems.length === 0) {
      addNotification({
        type: "warning",
        title: "No Items Selected",
        message: "Please select items to perform bulk action",
      });
      return;
    }

    setGlobalLoading(true, "Processing bulk action...");

    // Simulate API call
    setTimeout(() => {
      setGlobalLoading(false);
      addNotification({
        type: "success",
        title: "Bulk Action Complete",
        message: `Processed ${selectedItems.length} items`,
      });
    }, 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Zustand + React Query Example</h2>

      {/* App State */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">App State</h3>
        <div className="space-y-2">
          <p>Sidebar Collapsed: {sidebarCollapsed ? "Yes" : "No"}</p>
          <button
            onClick={toggleSidebar}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Sidebar
          </button>
        </div>
      </div>

      {/* Auth State */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Auth State</h3>
        <div className="space-y-2">
          <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
          {user && (
            <p>
              User: {user.name} ({user.role})
            </p>
          )}
          <div className="space-x-2">
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Inventory State */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Inventory State</h3>
        <div className="space-y-2">
          <p>Selected Items: {selectedItems.length}</p>
          <p>Search Filter: {filters.search || "None"}</p>
          <div className="space-x-2">
            <button
              onClick={() => toggleItemSelection("item-1")}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Toggle Item 1
            </button>
            <button
              onClick={() => setFilters({ search: "test" })}
              className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Set Search Filter
            </button>
            <button
              onClick={handleBulkAction}
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Bulk Action
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {globalLoading && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">Loading: {globalLoading}</p>
        </div>
      )}
    </div>
  );
}
