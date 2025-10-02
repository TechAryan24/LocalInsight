import React from "react";
import { Outlet } from "react-router-dom";
// Corrected the import paths to be more explicit.
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 flex-1">
          {/* Dashboard child routes will be loaded here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

