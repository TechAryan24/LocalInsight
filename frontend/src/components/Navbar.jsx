import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/auth'; // 1. Import useAuth

const Navbar = () => {
  const navigate = useNavigate();
  // 2. Get the current user and logout function from the context
  const { currentUser, logOut } = useAuth();

  // 3. Create a handler for the logout action
  const handleLogout = async () => {
    try {
      await logOut();
      // On success, redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide text-red-700">
        LocalInsight
      </div>

      {/* Links */}
      <ul className="flex space-x-10 text-lg font-medium text-gray-700">
        <li>
          <Link
            to="/"
            className="hover:text-red-500 transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/map"
            className="hover:text-red-500 transition-colors duration-200"
          >
            Map
          </Link>
        </li>
        <li>
          <Link
            to="/form"
            className="hover:text-red-500 transition-colors duration-200"
          >
            Form
          </Link>
        </li>
        {/* 4. Conditionally render the Dashboard link */}
        {currentUser && (
          <li>
            <Link
              to="/dashboard"
              className="hover:text-red-500 transition-colors duration-200"
            >
              Dashboard
            </Link>
          </li>
        )}
      </ul>

      {/* 5. Conditionally render auth buttons */}
      <div className="flex space-x-4">
        {currentUser ? (
          // If user is logged in, show Logout button
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        ) : (
          // If user is logged out, show Login and Signup buttons
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-red-500 px-5 py-2 rounded-lg font-semibold border border-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

