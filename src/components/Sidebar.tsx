import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "../stores/appStore";

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/", type: "link" },
    { id: "notifications", label: "Notifications", icon: "🔔", path: "/notifications", type: "link" },
    { 
      id: "inventory", 
      label: "Inventory", 
      icon: "📦", 
      type: "expandable",
      subItems: [
        { id: "view-items", label: "View Items", path: "/inventory" },
        { id: "add-item", label: "Add Item", path: "/inventory/add" }
      ]
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
            { id: "view-purchase-orders", label: "View Purchase Orders", path: "/orders/purchase" },
            { id: "create-purchase-order", label: "Create Purchase Order", path: "/orders/purchase/create" }
          ]
        },
        { 
          id: "sale-orders", 
          label: "Sale Orders", 
          type: "expandable",
          subItems: [
            { id: "view-sale-orders", label: "View Sale Orders", path: "/orders/sales" },
            { id: "create-sale-order", label: "Create Sale Order", path: "/orders/sales/create" }
          ]
        }
      ]
    },
    { id: "reports", label: "Reports", icon: "📈", path: "/reports", type: "link" },
  ];

  const renderMenuItem = (item: any) => {
    if (item.type === "expandable") {
      const isExpanded = expandedSections.includes(item.id);
      const hasActiveSubItem = item.subItems?.some((subItem: any) => 
        location.pathname === subItem.path || 
        (subItem.subItems && subItem.subItems.some((subSubItem: any) => 
          location.pathname === subSubItem.path
        ))
      );

      return (
        <li key={item.id}>
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              hasActiveSubItem
                ? "bg-red-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
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
          
          {isExpanded && !sidebarCollapsed && item.subItems && (
            <ul className="ml-6 mt-2 space-y-1">
              {item.subItems.map((subItem: any) => {
                if (subItem.type === "expandable") {
                  const isSubExpanded = expandedSections.includes(subItem.id);
                  const hasActiveSubSubItem = subItem.subItems?.some((subSubItem: any) => 
                    location.pathname === subSubItem.path
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
                            const isActive = location.pathname === subSubItem.path;
                            return (
                              <li key={subSubItem.id}>
                                <Link
                                  to={subSubItem.path}
                                  className={`flex items-center space-x-2 px-4 py-1 rounded-lg transition-colors text-xs ${
                                    isActive
                                      ? "bg-red-400 text-white"
                                      : "text-gray-500 hover:bg-gray-700 hover:text-white"
                                  }`}
                                >
                                  <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                                  <span>{subSubItem.label}</span>
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
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                        isActive
                          ? "bg-red-500 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <span className="w-2 h-2 bg-current rounded-full"></span>
                      <span>{subItem.label}</span>
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
    const isActive = location.pathname === item.path || 
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
            <span className="font-medium">{item.label}</span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <div
      className={`${
        sidebarCollapsed ? "w-16" : "w-64"
      } h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 relative`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              🛒
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold">Inventory MS</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(renderMenuItem)}
        </ul>
      </nav>

      {/* Collapse/Expand Button - Bottom Right Edge */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 bottom-8 w-6 h-6 bg-gray-800 border-2 border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 shadow-lg"
        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <svg
          className={`w-3 h-3 text-white transition-transform duration-200 ${
            sidebarCollapsed ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={sidebarCollapsed ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>
    </div>
  );
}
