import React from "react";
// Corrected the import to use a relative path.
import Sidebar from "../../components/Sidebar.jsx";

function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Renders the new Sidebar component */}
      <Sidebar />

      {/* Renders the main content for the dashboard welcome page */}
      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-3xl font-semibold mb-4">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">📊 Business Recommendation Card</div>
          <div className="bg-white p-4 rounded-lg shadow">👥 Demographics Overview</div>
          <div className="bg-white p-4 rounded-lg shadow">🚶 Footfall Analysis</div>
          <div className="bg-white p-4 rounded-lg shadow">🏪 Competitor Heatmap</div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

