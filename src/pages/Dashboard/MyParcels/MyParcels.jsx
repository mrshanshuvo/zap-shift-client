import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import moment from "moment";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: myParcels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return res.data;
    },
  });

  const handleDelete = async (parcelId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/parcels/${parcelId}`);
        Swal.fire("Deleted!", "Your parcel has been deleted.", "success");
        queryClient.invalidateQueries(["my-parcels", user?.email]); // Refresh parcel list
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the parcel.", error);
      }
    }
  };

  if (isLoading) return <div>Loading parcels...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">My Parcels</h2>
      <table className="table w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Title</th>
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {myParcels.map((parcel, index) => (
            <tr key={parcel._id} className="hover">
              <td>{index + 1}</td>
              <td>
                {parcel.parcelType === "Document"
                  ? "📄 Document"
                  : "📦 Non-Document"}
              </td>
              <td>{parcel.parcelName}</td>
              <td>
                {moment(parcel.creation_date).format("MMMM Do YYYY, h:mm A")}
              </td>
              <td>৳{parcel.cost}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${parcel.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                  {parcel.isPaid ? "Paid" : "Unpaid"}
                </span>
              </td>
              <td className="space-x-2">
                <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                  View
                </button>
                {!parcel.isPaid && (
                  <button className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Pay
                  </button>
                )}
                <button
                  onClick={() => handleDelete(parcel._id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
