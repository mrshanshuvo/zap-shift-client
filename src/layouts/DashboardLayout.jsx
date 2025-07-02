import React from "react";
import { NavLink, Outlet } from "react-router";
import ProFastLogo from "../pages/Shared/ProFastLogo/ProFastLogo";

const links = [
  { to: "/", label: "Home", delay: "0s" },
  { to: "/dashboard/myParcels", label: "My Parcels", delay: "0.1s" },
];

const DashboardLayout = () => {
  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-2");
    if (drawer?.checked) drawer.checked = false;
  };

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" aria-hidden="true" />

      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-2" aria-label="Open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
        </div>

        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay" aria-label="Close sidebar"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-200 text-base-content">
          <ProFastLogo />
          {links.map(({ to, label, delay }) => (
            <li
              key={to}
              className="transition-opacity duration-500 ease-in"
              style={{ animation: `fadeIn 0.5s ease forwards`, animationDelay: delay }}
            >
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-primary bg-primary/20 rounded-md px-3 py-1 transition-colors"
                    : "hover:bg-primary/10 rounded-md px-3 py-1 transition-colors"
                }
                onClick={closeDrawer}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}
          </style>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
