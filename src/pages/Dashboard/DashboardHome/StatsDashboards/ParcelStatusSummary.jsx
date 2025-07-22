import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Truck,
  PackageCheck,
  Timer,
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const iconMap = {
  not_collected: <Timer className="w-6 h-6 text-yellow-500" />,
  on_the_way: <Truck className="w-6 h-6 text-blue-500" />,
  assigned: <Send className="w-6 h-6 text-purple-500" />,
  delivered: <PackageCheck className="w-6 h-6 text-green-500" />,
};

const labelMap = {
  not_collected: "Not Collected",
  on_the_way: "On the Way",
  assigned: "Assigned",
  delivered: "Delivered",
};

const colorMap = {
  not_collected: "#FACC15", // yellow
  on_the_way: "#3B82F6",     // blue
  assigned: "#8B5CF6",       // purple
  delivered: "#22C55E",      // green
};

const bgMap = {
  not_collected: "bg-yellow-50",
  on_the_way: "bg-blue-50",
  assigned: "bg-purple-50",
  delivered: "bg-green-50",
};

const ParcelStatusSummary = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["statusSummary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
  });

  const totalParcels = data.reduce((sum, item) => sum + item.count, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 text-red-500">
        <AlertTriangle className="w-6 h-6 mr-2" /> Failed to load status data.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Parcel Status Dashboard</h2>
        <p className="text-gray-600">Overview of {totalParcels} total parcels</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.map(({ status, count }) => (
          <div
            key={status}
            className={`rounded-xl shadow-sm border ${bgMap[status] || "bg-gray-50"} p-6 flex items-center space-x-4 hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex-shrink-0">
              {iconMap[status] || (
                <AlertTriangle className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900">{count}</h4>
              <p className="text-sm text-gray-600 font-medium">
                {labelMap[status] || status}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {((count / totalParcels) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parcel Distribution</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ status, percent }) =>
                  `${labelMap[status] || status}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorMap[entry.status] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  value,
                  labelMap[name] || name
                ]}
              />
              <Legend
                formatter={(value) => labelMap[value] || value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ParcelStatusSummary;
