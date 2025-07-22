import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useAuth from "../../../hooks/useAuth";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  // State for assignment modal
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch parcels
  const { data: parcels = [], isLoading: parcelsLoading, error: parcelsError } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not_collected"
      );
      return res.data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
    },
  });

  // Fetch available riders
  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["availableRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=available");
      return res.data;
    },
  });

  // Assignment mutation
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, riderId }) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
        riderId,
        delivery_status: "assigned"
      });
      return res.data;
    },
    onSuccess: async () => {
      const parcel = selectedParcel;

      // Now safe to reset state
      setIsModalOpen(false);
      setSelectedParcel(null);
      setSelectedRider("");

      const toastId = toast.loading("Logging assignment...");

      try {
        queryClient.invalidateQueries(["assignableParcels"]);
        queryClient.invalidateQueries(["availableRiders"]);

        await logTracking({
          trackingId: parcel.trackingId,
          status: "assigned",
          details: `Assigned rider ${selectedRider} to parcel ${parcel.trackingId}`,
          location: parcel.senderServiceCenter,
          updated_by: user.email
        });

        toast.success("Rider assigned successfully!", { id: toastId });
      } catch (err) {
        console.error("Tracking log failed:", err);
        toast.error("Rider assigned, but tracking log failed.", { id: toastId });
      }
    },
    onError: (error) => {
      console.error("Assignment failed:", error);
      toast.error("Failed to assign rider. Please try again.");
    }
  });

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
    setSelectedRider(""); // Reset rider selection
  };

  const handleConfirmAssignment = () => {
    if (!selectedRider) {
      toast.error("Please select a rider");
      return;
    }

    assignRiderMutation.mutate({
      parcelId: selectedParcel._id,
      riderId: selectedRider
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedParcel(null);
    setSelectedRider("");
  };

  if (parcelsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (parcelsError) {
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
                    <div>{parcel.senderRegion}</div>
                    <div className="text-xs text-gray-500">
                      → {parcel.receiverRegion}
                    </div>
                  </td>
                  <td>{parcel.weight}</td>
                  <td>{parcel.cost}</td>
                  <td>
                    <button
                      className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                      onClick={() => handleAssignClick(parcel)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment Modal */}
      {isModalOpen && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Assign Rider</h3>

            {/* Parcel Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Parcel:</p>
              <p className="font-medium">{selectedParcel.parcelName}</p>
              <p className="text-sm text-gray-600 mt-1">
                ID: {selectedParcel.trackingId}
              </p>
              <p className="text-sm text-gray-600">
                {selectedParcel.senderRegion} → {selectedParcel.receiverRegion}
              </p>
            </div>

            {/* Rider Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Rider:
              </label>
              {ridersLoading ? (
                <div className="flex items-center justify-center py-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="ml-2">Loading riders...</span>
                </div>
              ) : (
                <select
                  value={selectedRider}
                  onChange={(e) => setSelectedRider(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Choose a rider</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name} - {rider.phone} ({rider.district})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={handleModalClose}
                disabled={assignRiderMutation.isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleConfirmAssignment}
                disabled={assignRiderMutation.isPending || !selectedRider}
              >
                {assignRiderMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Assigning...
                  </>
                ) : (
                  "Confirm Assignment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;