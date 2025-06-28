import React from 'react';
import { Outlet } from 'react-router';
import authImg from '../assets/authImage.png';
import ProFastLogo from '../pages/Shared/ProFastLogo/ProFastLogo';

const AuthLayout = () => {
  return (
    <div className="flex flex-col">
      {/* Header with logo */}
      <header className="px-6 py-4 md:px-12 md:py-6">
        <ProFastLogo />
      </header>

      {/* Main content area */}
      <main className="flex-grow flex items-center justify-center px-6 pb-12 md:px-12">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-8 lg:gap-16">
            {/* Authentication image - hidden on small screens if space is constrained */}
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={authImg}
                alt="Authentication illustration"
                className="max-w-sm w-full rounded-lg"
                loading="lazy"
              />
            </div>

            {/* Outlet container with responsive width */}
            <div className="lg:w-1/2 w-full max-w-md">
              <div className="bg-white p-8 rounded-lg">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer can be added here if needed */}
    </div>
  );
};

export default AuthLayout;