import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

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
      </ul>

      {/* Auth Buttons */}
      <div className="flex space-x-4">
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
      </div>
    </nav>
  );
};

export default Navbar;
