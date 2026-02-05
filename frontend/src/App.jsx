import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Map from "./pages/Map";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import StrategyDashboard from "./components/StrategyDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/strategy-dashboard"
          element={
            <PrivateRoute>
              <StrategyDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
