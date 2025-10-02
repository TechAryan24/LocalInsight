import React from "react";
import AuthLayout from "../../layouts/AuthLayout";

const Login = () => {
  return (
    <AuthLayout>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <div className="text-2xl font-bold text-red-700 mb-5">LocalInsights</div>
        <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Enter your email and password to access your account.
        </p>

        <form className="flex flex-col">
          <label className="text-left font-semibold mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="p-3 mb-5 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <label className="text-left font-semibold mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
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

          <button
            type="submit"
            className="bg-red-700 text-white py-3 rounded-md font-semibold mb-5 hover:bg-red-800 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
