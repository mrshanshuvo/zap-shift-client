import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import ProFastLogo from "../pages/Shared/ProFastLogo/ProFastLogo";
import {
  FiHome,
  FiPackage,
  FiSearch,
  FiCreditCard,
  FiEdit,
  FiUserCheck,
} from "react-icons/fi";
import {
  MdOutlineGroups,
  MdOutlineLocalShipping,
  MdOutlinePending,
} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import { FaMotorcycle } from "react-icons/fa";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
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
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
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
    },
    {
      to: "/dashboard/paymentHistory",
      label: "Payment History",
      icon: <FiCreditCard className="text-lg" />,
      delay: "0.1s",
    },
    {
      to: "/dashboard/trackParcel",
      label: "Track Parcels",
      icon: <MdOutlineLocalShipping className="text-lg" />,
      delay: "0.2s",
    },
    {
      to: "/dashboard/updateProfile",
      label: "Update Profile",
      icon: <FiEdit className="text-lg" />,
      delay: "0.4s",
    },
    // Conditionally push admin-only routes
    ...(!roleLoading && role === "admin"
      ? [
        {
          to: "/dashboard/approvedRiders",
          label: "Approved Riders",
          icon: <MdOutlineGroups className="text-lg" />,
          delay: "0.5s",
        },
        {
          to: "/dashboard/pendingRiders",
          label: "Pending Riders",
          icon: <MdOutlinePending className="text-lg" />,
          delay: "0.6s",
        },
        {
          to: "/dashboard/makeAdmins",
          label: "Make Admins",
          icon: <FiUserCheck className="text-lg" />,
          delay: "0.7s",
        },
        {
          to: "/dashboard/assignRider",
          label: "Assign Rider",
          icon: <FaMotorcycle className="text-lg" />,
          delay: "0.8s",
        },
      ]
      : []),
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
        <div className="menu p-4 overflow-y-auto w-50 bg-base-100 text-base-content border-r border-base-200 flex flex-col h-full">
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
