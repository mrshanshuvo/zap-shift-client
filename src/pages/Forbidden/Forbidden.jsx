import React from "react";
import { Link } from "react-router";
import { FiAlertTriangle } from "react-icons/fi";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center">
        <div className="flex justify-center mb-4">
          <FiAlertTriangle className="text-red-500 text-6xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">403 - Forbidden</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don’t have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
