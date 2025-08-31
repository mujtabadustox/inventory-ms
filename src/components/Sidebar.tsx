import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../stores/appStore";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      path: "/",
      type: "link",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "🔔",
      path: "/notifications",
      type: "link",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: "📦",
      type: "expandable",
      subItems: [
        { id: "view-items", label: "View Items", path: "/inventory" },
        { id: "add-item", label: "Add Item", path: "/inventory/add" },
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: "📋",
      type: "expandable",
      subItems: [
        {
          id: "purchase-orders",
          label: "Purchase Orders",
          type: "expandable",
          subItems: [
            {
              id: "view-purchase-orders",
              label: "View Purchase Orders",
              path: "/orders/purchase",
            },
            {
              id: "create-purchase-order",
              label: "Create Purchase Order",
              path: "/orders/purchase/create",
            },
          ],
        },
        {
          id: "sale-orders",
          label: "Sale Orders",
          type: "expandable",
          subItems: [
            {
              id: "view-sale-orders",
              label: "View Sale Orders",
              path: "/orders/sales",
            },
            {
              id: "create-sale-order",
              label: "Create Sale Order",
              path: "/orders/sales/create",
            },
          ],
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: "📈",
      path: "/reports",
      type: "link",
    },
  ];

  const renderMenuItem = (item: any) => {
    if (item.type === "expandable") {
      const isExpanded = expandedSections.includes(item.id);
      const hasActiveSubItem = item.subItems?.some(
        (subItem: any) =>
          location.pathname === subItem.path ||
          (subItem.subItems &&
            subItem.subItems.some(
              (subSubItem: any) => location.pathname === subSubItem.path
            ))
      );

      return (
        <li key={item.id}>
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center justify-between transition-colors ${
              sidebarCollapsed ? "px-2 py-2" : "px-4 py-3 rounded-lg"
            } ${
              hasActiveSubItem
                ? "bg-red-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <div className="flex items-center space-x-3">
              <span className={`${sidebarCollapsed ? "text-base" : "text-lg"}`}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {sidebarCollapsed && (
                <span className="text-xs text-gray-400">▼</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <svg
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {/* Show sub-items when expanded OR when sidebar is collapsed (for better UX) */}
          {(isExpanded || sidebarCollapsed) && item.subItems && (
            <ul
              className={`${
                sidebarCollapsed ? "mt-1 space-y-0.5" : "ml-6 mt-2"
              } space-y-1`}
            >
              {item.subItems.map((subItem: any) => {
                if (subItem.type === "expandable") {
                  const isSubExpanded = expandedSections.includes(subItem.id);
                  const hasActiveSubSubItem = subItem.subItems?.some(
                    (subSubItem: any) => location.pathname === subSubItem.path
                  );

                  return (
                    <li key={subItem.id}>
                      <button
                        onClick={() => toggleSection(subItem.id)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors text-sm ${
                          hasActiveSubSubItem
                            ? "bg-red-500 text-white"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-current rounded-full"></span>
                          <span>{subItem.label}</span>
                        </div>
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            isSubExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isSubExpanded && subItem.subItems && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {subItem.subItems.map((subSubItem: any) => {
                            const isActive =
                              location.pathname === subSubItem.path;
                            return (
                              <li key={subSubItem.id}>
                                <Link
                                  to={subSubItem.path}
                                  className={`block w-full px-4 py-1 rounded-lg transition-colors text-xs ${
                                    isActive
                                      ? "bg-red-400 text-white"
                                      : "text-gray-500 hover:bg-gray-700 hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                                    <span>{subSubItem.label}</span>
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Regular sub-item
                const isActive = location.pathname === subItem.path;
                return (
                  <li key={subItem.id}>
                    <Link
                      to={subItem.path}
                      className={`block w-full transition-colors text-sm ${
                        sidebarCollapsed ? "px-2 py-1" : "px-4 py-2 rounded-lg"
                      } ${
                        isActive
                          ? "bg-red-500 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                      title={sidebarCollapsed ? subItem.label : undefined}
                    >
                      <div className="flex items-center space-x-2">
                        {!sidebarCollapsed && (
                          <span className="w-2 h-2 bg-current rounded-full"></span>
                        )}
                        {!sidebarCollapsed && <span>{subItem.label}</span>}
                        {sidebarCollapsed && <span className="text-xs">•</span>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    // Regular menu item
    const isActive =
      location.pathname === item.path ||
      (item.path === "/" && location.pathname === "/dashboard");

    return (
      <li key={item.id}>
        <Link
          to={item.path}
          className={`block w-full transition-colors ${
            sidebarCollapsed ? "px-2 py-2" : "px-4 py-3 rounded-lg"
          } ${
            isActive
              ? "bg-red-600 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
          title={sidebarCollapsed ? item.label : undefined}
        >
          <div className="flex items-center space-x-3">
            <span className={`${sidebarCollapsed ? "text-base" : "text-lg"}`}>
              {item.icon}
            </span>
            {!sidebarCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </div>
        </Link>
      </li>
    );
  };

  // Render collapsed sidebar with quick access icons
  const renderCollapsedSidebar = () => {
    return (
      <div className="w-16 h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 relative">
        {/* Logo Section - Clickable */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={handleLogoClick}
            className="w-full flex items-center justify-center hover:opacity-80 transition-opacity"
            title="Go to Dashboard"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              🛒
            </div>
          </button>
        </div>

        {/* Quick Access Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <Link
                to="/"
                className={`block w-full p-2 text-center transition-colors ${
                  location.pathname === "/" ||
                  location.pathname === "/dashboard"
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title="Dashboard"
              >
                <span className="text-lg">📊</span>
              </Link>
            </li>

            {/* Inventory Quick Access */}
            <li>
              <Link
                to="/inventory"
                className={`block w-full p-2 text-center transition-colors ${
                  location.pathname === "/inventory"
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title="View Inventory"
              >
                <span className="text-lg">📦</span>
              </Link>
            </li>

            {/* Purchase Orders Quick Access */}
            <li>
              <Link
                to="/orders/purchase"
                className={`block w-full p-2 text-center transition-colors ${
                  location.pathname === "/orders/purchase"
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title="Purchase Orders"
              >
                <span className="text-lg">📋</span>
              </Link>
            </li>

            {/* Sale Orders Quick Access */}
            <li>
              <Link
                to="/orders/sales"
                className={`block w-full p-2 text-center transition-colors ${
                  location.pathname === "/orders/sales"
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title="Sale Orders"
              >
                <span className="text-lg">💰</span>
              </Link>
            </li>

            {/* Notifications */}
            <li>
              <Link
                to="/notifications"
                className={`block w-full p-2 text-center transition-colors ${
                  location.pathname === "/notifications"
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title="Notifications"
              >
                <span className="text-lg">🔔</span>
              </Link>
            </li>

            {/* Reports */}
            <li>
              <Link
                to="/reports"
                className={`block w-full p-2 text-center transition-colors ${
                  location.pathname === "/reports"
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title="Reports"
              >
                <span className="text-lg">📈</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Collapse/Expand Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 bottom-8 w-8 h-8 bg-gray-800 border-2 border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 shadow-lg"
          title="Expand Sidebar"
        >
          <svg
            className="w-4 h-4 text-white transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  };

  // Render expanded sidebar normally
  const renderExpandedSidebar = () => {
    return (
      <div className="w-64 h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 relative">
        {/* Logo Section - Clickable */}
        <div className="p-6 border-b border-gray-700">
          <button
            onClick={handleLogoClick}
            className="w-full flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                🛒
              </div>
              <span className="text-xl font-bold">Inventory MS</span>
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
        </nav>

        {/* Collapse/Expand Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 bottom-8 w-8 h-8 bg-gray-800 border-2 border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 shadow-lg"
          title="Collapse Sidebar"
        >
          <svg
            className="w-4 h-4 text-white transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    );
  };

  return sidebarCollapsed ? renderCollapsedSidebar() : renderExpandedSidebar();
}
