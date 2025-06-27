import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import ProFastLogo from "../ProFastLogo/ProFastLogo";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", end: true },
    { path: "/about", label: "About Us" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  const toggleDarkMode = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar bg-base-100 dark:bg-base-200 shadow-sm rounded-2xl mb-14 sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
        </div>

        {/* Logo */}
        <NavLink
          to="/"
          className="btn btn-ghost text-xl p-0 hover:bg-transparent"
          aria-label="Go to homepage"
          onClick={closeMobileMenu}
        >
          <ProFastLogo />
        </NavLink>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-colors ${isActive
                    ? "bg-primary text-primary-content font-medium"
                    : "hover:bg-base-200 dark:hover:bg-base-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {/* DaisyUI Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="btn btn-ghost btn-circle"
          aria-label="Toggle dark mode"
        >
          <SunIcon className="h-5 w-5 block dark:hidden" />
          <MoonIcon className="h-5 w-5 hidden dark:block" />
        </button>

        <NavLink
          to="/get-started"
          className="btn btn-primary hover:scale-105 transition-transform"
        >
          Get Started
        </NavLink>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-base-100 dark:bg-base-200 shadow-lg rounded-b-2xl z-40">
          <ul className="menu p-4 w-full">
            {navItems.map((item) => (
              <li key={`mobile-${item.path}`}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg my-1 ${isActive
                      ? "bg-primary text-primary-content font-medium"
                      : "hover:bg-base-200 dark:hover:bg-base-300"
                    }`
                  }
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-4">
              <NavLink
                to="/get-started"
                onClick={closeMobileMenu}
                className="btn btn-primary w-full"
              >
                Get Started
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;