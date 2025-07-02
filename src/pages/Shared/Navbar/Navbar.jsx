import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";
import ProFastLogo from "../ProFastLogo/ProFastLogo";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth(); // Assuming useAuth provides logOut
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const activeClass = "bg-slate-900 text-white shadow-sm";
  const inactiveClass =
    "text-slate-700 hover:text-slate-900 hover:bg-slate-100";

  // Reusable NavItem component
  const NavItem = ({ to, children, end = false }) => (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? activeClass : inactiveClass
          }`
        }
        onClick={closeMobileMenu}
      >
        {children}
      </NavLink>
    </li>
  );

  // Handle logOut
  const handleLogOut = () => {
    closeMobileMenu();
    if (logOut) {
      logOut();
    }
    navigate("/login");
  };

  return (
    <nav className="bg-white mb-8 border-b border-slate-200 sticky top-0 z-50 transition-all duration-300 rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <HiX className="h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <ProFastLogo />
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-1 list-none m-0 p-0">
            <NavItem to="/" end>
              Home
            </NavItem>
            <NavItem to="/addParcel">Add Parcel</NavItem>
            <NavItem to="/coverage">Coverage</NavItem>
            {user && <NavItem to="/dashboard">Dashboard</NavItem>}
            <NavItem to="/about">About Us</NavItem>
          </ul>

          {/* Call to action */}
          <div className="flex items-center space-x-3">
            <NavLink
              to="/contact"
              className="hidden sm:inline-flex px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>

            {user ? (
              <button
                onClick={handleLogOut}
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg hover:from-slate-800 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <ul className="px-4 py-4 space-y-2 list-none m-0 p-0">
            <NavItem to="/" end>
              Home
            </NavItem>
            <NavItem to="/addParcel">Add Parcel</NavItem>
            <NavItem to="/coverage">Coverage</NavItem>
            {user && <NavItem to="/dashboard">Dashboard</NavItem>}
            <NavItem to="/about">About Us</NavItem>
          </ul>

          <NavLink
            to="/contact"
            className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
            onClick={closeMobileMenu}
          >
            Contact
          </NavLink>

          <div className="pt-4 border-t border-slate-200">
            {user ? (
              <button
                onClick={handleLogOut}
                className="flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg hover:from-slate-800 hover:to-slate-700 transition-all duration-200 shadow-sm"
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
