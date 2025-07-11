import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import ProFastLogo from "../pages/Shared/ProFastLogo/ProFastLogo";
import {
  FiHome,
  FiPackage,
  FiPlus,
  FiSearch,
  FiCreditCard,
  FiEdit,
} from "react-icons/fi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashboardLayout = () => {
  const [activePath, setActivePath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const location = useLocation();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  // Fetch parcels data
  const { data: parcelsData = [] } = useQuery({
    enabled: !!user?.email,
    queryKey: ["dashboard-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return res.data;
    },
  });

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer-2");
    if (drawer?.checked) drawer.checked = false;
  };

  // Calculate dashboard stats
  const totalParcels = parcelsData.length;
  const paidParcels = parcelsData.filter((parcel) => parcel.isPaid).length;
  const pendingParcels = totalParcels - paidParcels;
  const totalCost = parcelsData.reduce((sum, parcel) => sum + parcel.cost, 0);

  const navLinks = [
    {
      to: "/",
      label: "Dashboard",
      icon: <FiHome className="text-lg" />,
      delay: "0s",
    },
    {
      to: "/dashboard/myParcels",
      label: "My Parcels",
      icon: <FiPackage className="text-lg" />,
      delay: "0.1s",
      badge: pendingParcels,
    },
    {
      to: "/dashboard/paymentHistory",
      label: "Payment History",
      icon: <FiCreditCard className="text-lg" />,
      delay: "0.1s",
    },
    {
      to: "/dashboard/tractParcel",
      label: "Tract a Parcel",
      icon: <MdOutlineLocalShipping className="text-lg" />,
      delay: "0.2s",
    },
    {
      to: "/dashboard/updateProfile",
      label: "Update Profile",
      icon: <FiEdit className="text-lg" />,
      delay: "0.4s",
    },
  ];
  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen bg-base-100">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle"
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">

        {/* Dashboard Stats (Only shown on home route) */}
        {activePath === "/" && (
          <div className="px-6 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stats bg-base-100 shadow border border-base-200">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FiPackage className="text-2xl" />
                </div>
                <div className="stat-title">Total Parcels</div>
                <div className="stat-value">{totalParcels}</div>
                <div className="stat-desc">All your shipments</div>
              </div>
            </div>

            <div className="stats bg-base-100 shadow border border-base-200">
              <div className="stat">
                <div className="stat-figure text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Paid Parcels</div>
                <div className="stat-value">{paidParcels}</div>
                <div className="stat-desc">Ready for shipping</div>
              </div>
            </div>

            <div className="stats bg-base-100 shadow border border-base-200">
              <div className="stat">
                <div className="stat-figure text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Pending Payment</div>
                <div className="stat-value">{pendingParcels}</div>
                <div className="stat-desc">Require attention</div>
              </div>
            </div>

            <div className="stats bg-base-100 shadow border border-base-200">
              <div className="stat">
                <div className="stat-figure text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Total Cost</div>
                <div className="stat-value">৳{totalCost}</div>
                <div className="stat-desc">All shipments</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 bg-base-50">
          <div className="max-w-7xl mx-auto">
            {/* Action Bar (Only shown on My Parcels route) */}
            {activePath === "/dashboard/myParcels" && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold">My Parcels</h2>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search parcels..."
                      className="input input-bordered pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="select select-bordered w-full md:w-auto"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <button className="btn btn-primary gap-2">
                    <FiPlus /> New Parcel
                  </button>
                </div>
              </div>
            )}

            <Outlet context={{ parcelsData, searchTerm, filterStatus }} />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          className="drawer-overlay"
          aria-label="Close sidebar"
        ></label>
        <div className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content border-r border-base-200 flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-6">
            <ProFastLogo />
          </div>

          {/* Primary Navigation */}
          <ul className="flex-1">
            {navLinks.map(({ to, label, icon, delay, badge }) => (
              <li
                key={to}
                className="mb-1"
                style={{
                  animation: `fadeIn 0.5s ease forwards`,
                  animationDelay: delay,
                }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-primary bg-primary/10 rounded-lg px-4 py-3 transition-all"
                      : "hover:bg-base-200 rounded-lg px-4 py-3 transition-all"
                  }
                  onClick={closeDrawer}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{icon}</span>
                    <span>{label}</span>
                  </div>
                  {badge > 0 && (
                    <span className="badge badge-primary badge-sm">
                      {badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
