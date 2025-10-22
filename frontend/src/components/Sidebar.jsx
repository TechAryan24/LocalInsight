// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // Sidebar navigation items
  const navItems = [
    { name: "Business Insights", path: "/dashboard/business", icon: "📊" },
    { name: "Demographics", path: "/dashboard/demographics", icon: "👥" },
    { name: "Mobility", path: "/dashboard/mobility", icon: "🚶" },
    { name: "Competitors", path: "/dashboard/competitors", icon: "🏪" },
    { name: "Inventory", path: "/dashboard/inventory", icon: "📦" },
    { name: "Reports", path: "/dashboard/reports", icon: "📑" },
    { name: "Settings", path: "/dashboard/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Local Insight</h2>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
