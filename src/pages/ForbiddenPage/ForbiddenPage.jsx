import React from 'react';
import { NavLink } from 'react-router';
import { FaLock } from "react-icons/fa";

const ForbiddenPage = () => {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center  font-sans px-4">
            <div className="p-8 rounded-lg shadow-[0_0px_15px_20px_rgba(250,0,0,0.05),0_0px_5px_5px_rgba(252,035,002,0.1)] bg-base-300 text-center max-w-md w-full">
                <h1 className="text-6xl flex justify-center font-bold text-red-600 mb-4">
                    <FaLock />
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold text-secondary-content mb-4">Access Denied</h2>
                <p className="text-lg text-gray-500 mb-8">
                    You do not have permission to view this page or perform this action.
                    Please contact your administrator if you believe this is an error.
                </p>
                <NavLink
                    to="/" // Link to your home page or dashboard
                    className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Go to Home
                </NavLink>
            </div>
        </div>
    );
};

export default ForbiddenPage;
