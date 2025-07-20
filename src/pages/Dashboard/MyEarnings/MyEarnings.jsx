import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const timeFilters = ["today", "week", "month", "year", "all"];

const isWithinRange = (date, range) => {
  const now = new Date();
  const d = new Date(date);
  switch (range) {
    case "today":
      return d.toDateString() === now.toDateString();
    case "week": {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      return d >= weekStart && d <= now;
    }
    case "month":
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    case "year":
      return d.getFullYear() === now.getFullYear();
    default:
      return true;
  }
};

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedRange, setSelectedRange] = useState("all");

  const { data: deliveredParcels = [], isLoading: loadingParcels } = useQuery({
    queryKey: ["deliveredParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels?rider_email=${user?.email}&delivery_status=delivered`
      );
      return res.data;
    },
  });

  const { data: cashouts = [], isLoading: loadingCashouts } = useQuery({
    queryKey: ["cashouts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/cashouts?rider_email=${user?.email}`);
      return res.data;
    },
  });

  const {
    totalEarning,
    cashedOutEarning,
    pendingEarning,
    filteredCashouts,
  } = useMemo(() => {
    const filteredDelivered = deliveredParcels.filter(p =>
      isWithinRange(p.delivered_at, selectedRange)
    );
    const filteredCashouts = cashouts.filter(c =>
      isWithinRange(c.cashed_out_at, selectedRange)
    );

    const totalEarning = filteredDelivered.reduce((sum, p) => sum + (p.rider_earning || 0), 0);
    const cashedOutEarning = filteredCashouts.reduce((sum, c) => sum + (c.earning || 0), 0);
    const pendingEarning = totalEarning - cashedOutEarning;

    return {
      totalEarning,
      cashedOutEarning,
      pendingEarning,
      filteredCashouts,
    };
  }, [deliveredParcels, cashouts, selectedRange]);

  if (loadingParcels || loadingCashouts) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Earnings Analysis</h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {timeFilters.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-3 py-1 rounded border ${selectedRange === range
                ? "bg-green-600 text-white"
                : "bg-white border-gray-300 text-gray-700"
              }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Earnings Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-white border p-4 rounded-xl shadow">
          <h3 className="text-gray-600">Total Earned</h3>
          <p className="text-2xl font-bold text-green-600">৳{totalEarning.toFixed(2)}</p>
        </div>
        <div className="bg-white border p-4 rounded-xl shadow">
          <h3 className="text-gray-600">Cashed Out</h3>
          <p className="text-2xl font-bold text-blue-600">৳{cashedOutEarning.toFixed(2)}</p>
        </div>
        <div className="bg-white border p-4 rounded-xl shadow">
          <h3 className="text-gray-600">Pending</h3>
          <p className="text-2xl font-bold text-red-600">৳{pendingEarning.toFixed(2)}</p>
        </div>
      </div>

      {/* Cashout Table */}
      <h3 className="text-xl font-semibold mb-3">Cashout History ({selectedRange})</h3>
      {filteredCashouts.length === 0 ? (
        <div className="text-center text-gray-500">No cashouts found in this range.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border">#</th>
                <th className="py-2 px-3 border">Parcel</th>
                <th className="py-2 px-3 border">Tracking ID</th>
                <th className="py-2 px-3 border">Earning</th>
                <th className="py-2 px-3 border">Cashed Out At</th>
              </tr>
            </thead>
            <tbody>
              {filteredCashouts.map((entry, idx) => (
                <tr key={entry._id} className="text-center">
                  <td className="py-2 px-3 border">{idx + 1}</td>
                  <td className="py-2 px-3 border">{entry.parcel_name || "N/A"}</td>
                  <td className="py-2 px-3 border">{entry.trackingId}</td>
                  <td className="py-2 px-3 border text-green-700 font-semibold">
                    ৳{(entry.earning || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 border">
                    {new Date(entry.cashed_out_at).toLocaleString("en-BD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEarnings;
