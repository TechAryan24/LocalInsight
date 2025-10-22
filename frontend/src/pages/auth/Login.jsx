import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // You'll need this for navigation
import AuthLayout from "../../layouts/AuthLayout"; // Ignoring this path as requested
import { useAuth } from "../../context/auth"; // Ignoring this path as requested

const Login = () => {
  // 1. Add state for form inputs, errors, and loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 2. Get the signIn function from the context
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // 3. Create a function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setError("");
    setLoading(true);
    const user = await signIn(email, password); // only succeeds if user exists
    navigate("/dashboard"); // safe
  } catch (err) {
    setError("Failed to sign in. Please check your email and password.");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="text-2xl font-bold text-red-700 mb-5">LocalInsights</div>
        <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Enter your email and password to access your account.
        </p>
        
        {/* 4. Display an error message if one exists */}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 5. Connect inputs to state */}
          <label className="text-left font-semibold mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 mb-5 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <label className="text-left font-semibold mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 mb-5 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <div className="flex justify-between items-center mb-5 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="w-4 h-4" /> Remember Me
            </label>
            <a href="#" className="text-red-700 font-bold hover:underline">
              Forgot Your Password?
            </a>
          </div>

          {/* 6. Handle loading state in the button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-700 text-white py-3 rounded-md font-semibold mb-5 hover:bg-red-800 transition disabled:bg-red-400"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <p className="text-sm">
            Don't have an account?{" "}
            <a onClick={() => navigate('/register')} className="text-red-700 font-semibold cursor-pointer hover:underline">
                Register
            </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;

