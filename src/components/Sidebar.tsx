import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "../stores/appStore";

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/" },
    { id: "inventory", label: "Inventory", icon: "📦", path: "/inventory" },
    { id: "sales", label: "Sales", icon: "💰", path: "/sales" },
    { id: "purchases", label: "Purchases", icon: "🛒", path: "/purchases" },
    { id: "reports", label: "Reports", icon: "📈", path: "/reports" },
  ];

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-64"
      } h-screen bg-gray-800 text-white flex flex-col transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              🛒
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold">Inventory MS</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/" && location.pathname === "/dashboard");
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
