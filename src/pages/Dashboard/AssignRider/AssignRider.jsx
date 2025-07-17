import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], isLoading, error } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load parcels.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Assign Rider to Parcels</h2>
      {parcels.length === 0 ? (
        <p className="text-gray-500">No parcels available for assignment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Parcel Name</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>From → To</th>
                <th>Weight (kg)</th>
                <th>Cost (৳)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id} className="hover">
                  <td>{index + 1}</td>
                  <td>{parcel.trackingId}</td>
                  <td>{parcel.parcelName}</td>
                  <td>
                    <div className="text-sm">
                      <div className="font-medium">{parcel.senderName}</div>
                      <div className="text-gray-500 text-xs">
                        {parcel.senderContact}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div className="font-medium">{parcel.receiverName}</div>
                      <div className="text-gray-500 text-xs">
                        {parcel.receiverContact}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">
                    <div>{parcel.senderDistrict}</div>
                    <div className="text-xs text-gray-500">
                      → {parcel.receiverDistrict}
                    </div>
                  </td>
                  <td>{parcel.weight}</td>
                  <td>{parcel.cost}</td>
                  <td>
                    <button className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded">
                      Assign
                    </button>
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

export default AssignRider;
