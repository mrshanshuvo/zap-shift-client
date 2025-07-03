import React from "react";
import { useOutletContext, useNavigate } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";
import { FiEye, FiDollarSign, FiTrash2, FiPackage, FiPlus } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

const MyParcels = () => {
  const { user } = useAuth();
  const { parcelsData, searchTerm, filterStatus } = useOutletContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // Filter parcels based on search and status
  const filteredParcels = parcelsData.filter(parcel => {
    const matchesSearch = parcel.parcelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.parcelType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "paid" && parcel.isPaid) ||
      (filterStatus === "unpaid" && !parcel.isPaid);

    return matchesSearch && matchesStatus;
  });

  const handlePay = (parcelId) => {
    navigate(`/dashboard/payment/${parcelId}`);
  };

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
        await queryClient.invalidateQueries(["dashboard-parcels", user?.email]);
        Swal.fire({
          title: "Deleted!",
          text: "Your parcel has been deleted.",
          icon: "success"
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete the parcel",
          icon: "error"
        });
      }
    }
  };

  if (parcelsData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No parcels yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new parcel shipment.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/dashboard/new-parcel")}
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Parcel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredParcels.map((parcel, index) => (
              <tr key={parcel._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {parcel.parcelType === "Document" ? (
                      <span className="mr-2">📄</span>
                    ) : (
                      <span className="mr-2">📦</span>
                    )}
                    {parcel.parcelType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {parcel.parcelName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(parcel.creation_date).format("MMM D, YYYY h:mm A")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ৳{parcel.cost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${parcel.isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                    aria-label={parcel.isPaid ? "Paid" : "Pending"}
                  >
                    {parcel.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard/parcels/${parcel._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label="View parcel details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    {!parcel.isPaid && (
                      <button
                        onClick={() => handlePay(parcel._id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        aria-label="Pay for parcel"
                      >
                        <FiDollarSign className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label="Delete parcel"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;