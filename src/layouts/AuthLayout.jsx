// src/layouts/AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 font-sans">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
