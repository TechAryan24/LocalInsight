import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/auth";

const Register = () => {
  // 1. Add state for form inputs, errors, and loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Get the signUp function from the context
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // 3. Create a function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      // Call the signUp function from the context
      await signUp(email, password);
      // On success, navigate to a protected route
      navigate("/dashboard");
    } catch (err){
      setError("Failed to create an account. Please try again.");
      console.error("Registration Error:", err);
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-2">Create an Account</h1>
        <p className="text-gray-500 text-sm mb-6">
          Get started with LocalInsights AI.
        </p>

        {/* 4. Display an error message if one exists */}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Full Name (Not connected to state, as it's not in the auth function) */}
          <label className="text-left font-semibold mb-1 mt-3">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          
          {/* 5. Connect inputs to state */}
          <label className="text-left font-semibold mb-1 mt-3">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <label className="text-left font-semibold mb-1 mt-3">Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <label className="text-left font-semibold mb-1 mt-3">Confirm Password</label>
          <input
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <div className="flex items-center mb-5 mt-3 text-sm">
            <input type="checkbox" id="terms" className="w-4 h-4" required />
            <label htmlFor="terms" className="ml-2">
              I agree to the <span className="text-red-700 font-semibold">Terms and Conditions</span>
            </label>
          </div>

          {/* 6. Handle loading state in the button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-700 text-white py-3 rounded-md w-full font-semibold hover:bg-red-800 transition disabled:bg-red-400"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className="text-sm mt-4">
            Already have an account?{" "}
            <a onClick={() => navigate('/login')} className="text-red-700 font-semibold cursor-pointer hover:underline">
                Log In
            </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;

