"use client"; // Mark this file as a client component

import React from "react";
import Login from "../components/login"; // Import the Login component
const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Login />
    </div>
  );
};

export default LoginPage;
