import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 To track current route
  const { currentUser, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Helper function for active link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#060012] via-[#0b001a] to-[#060012] backdrop-blur-md border-b border-gray-800 shadow-[0_0_20px_rgba(120,0,255,0.1)] transition-all duration-300">
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-3xl font-extrabold cursor-pointer tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-400 to-blue-400 hover:scale-105 transition-transform duration-300"
        >
          LocalInsight
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10 text-lg font-medium text-gray-300">
          {[
            { name: "Home", path: "/" },
            { name: "Map", path: "/map" },
            { name: "Form", path: "/form" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`relative group ${
                  isActive(item.path) ? "text-fuchsia-400" : "text-gray-300"
                } transition-colors duration-200`}
              >
                <span>{item.name}</span>
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-blue-500 transition-all duration-300 ${
                    isActive(item.path)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </li>
          ))}

          {currentUser && (
            <li>
              <Link
                to="/dashboard"
                className={`relative group ${
                  isActive("/dashboard")
                    ? "text-fuchsia-400"
                    : "text-gray-300"
                } transition-colors duration-200`}
              >
                Dashboard
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-blue-500 transition-all duration-300 ${
                    isActive("/dashboard")
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </li>
          )}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-[0_0_15px_rgba(255,0,255,0.5)] transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-[0_0_15px_rgba(0,120,255,0.5)] transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-300"
              >
                Signup
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0b0015] border-t border-gray-800 py-4 px-6 space-y-4 text-gray-300 text-lg animate-slideDown">
          {[
            { name: "Home", path: "/" },
            { name: "Map", path: "/map" },
            { name: "Form", path: "/form" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block ${
                isActive(item.path) ? "text-fuchsia-400" : "text-gray-300"
              } hover:text-fuchsia-400 transition-colors duration-200`}
            >
              {item.name}
            </Link>
          ))}

          {currentUser && (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`block ${
                isActive("/dashboard")
                  ? "text-fuchsia-400"
                  : "text-gray-300"
              } hover:text-fuchsia-400`}
            >
              Dashboard
            </Link>
          )}

          {currentUser ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500 text-white px-5 py-2 rounded-xl font-semibold"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsOpen(false);
                }}
                className="w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 text-white px-5 py-2 rounded-xl font-semibold"
              >
                Signup
              </button>
            </>
          )}
        </div>
      )}
    </nav>
    
  );
};

export default Navbar;
