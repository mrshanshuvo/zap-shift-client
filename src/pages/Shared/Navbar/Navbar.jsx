import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import ProFastLogo from "../ProFastLogo/ProFastLogo";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", end: true },
    { path: "/coverage", label: "Coverage" },
    { path: "/about", label: "About Us" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white mb-8 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 transition-all duration-300 rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <ProFastLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Call-to-action */}
          <div className="flex items-center space-x-3">
            <NavLink
              to="/contact"
              className="hidden sm:inline-flex px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              Contact
            </NavLink>
            <NavLink
              to="/login"
              className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 dark:text-slate-900 rounded-lg hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-100 dark:hover:to-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-slate-400 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Login
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={`mobile-${item.path}`}
                to={item.path}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.label}
              </NavLink>
            ))}
            {/* Mobile Contact Link */}
            <NavLink
              to="/contact"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              Contact
            </NavLink>
            {/* Mobile Login Button */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 dark:text-slate-900 rounded-lg hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-100 dark:hover:to-slate-200 transition-all duration-200 shadow-sm"
              >
                Login
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
