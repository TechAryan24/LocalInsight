import React from "react";
import AuthLayout from "../../layouts/AuthLayout";

const Register = () => {
  return (
    <AuthLayout>
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-2">Register for LocalInsights AI</h1>
        <p className="text-gray-500 text-sm mb-8">
          Help us understand your business better.
        </p>

        <form className="flex flex-col">
          <label className="text-left font-semibold mb-1 mt-3">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <label className="text-left font-semibold mb-1 mt-3">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <label className="text-left font-semibold mb-1 mt-3">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <label className="text-left font-semibold mb-1 mt-3">Confirm Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full p-3 mb-3 border rounded-md border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <div className="flex items-center mb-5 mt-3 text-sm">
            <input type="checkbox" id="terms" className="w-4 h-4" />
            <label htmlFor="terms" className="ml-2">
              I agree to the <span className="text-red-700 font-semibold">Terms and Conditions</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-red-700 text-white py-3 rounded-md w-full font-semibold hover:bg-red-800 transition"
          >
            Register
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
