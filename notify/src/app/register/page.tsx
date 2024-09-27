"use client"; // Mark this file as a client component

import React from "react";
import Signup from "../components/signup"; // Import the Signup component

const SignupPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Signup />
    </div>
  );
};

export default SignupPage;
