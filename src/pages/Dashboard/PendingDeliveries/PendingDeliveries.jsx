import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useAuth from "../../../hooks/useAuth";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  // State for status update
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch assigned parcels
  const { data: parcels = [], isLoading, error } = useQuery({
    queryKey: ["riderParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/parcels");
      return res.data.data;
    },
    onError: (error) => {
      toast.error("Failed to load assigned parcels");
      console.error("Error fetching parcels:", error);
    }
  });

  // Only show parcels that are NOT delivered
  const pendingParcels = parcels.filter(
    (parcel) => parcel.delivery_status !== "delivered"
  );

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcelId, status }) => {
      const res = await axiosSecure.patch(`/rider/parcels/${parcelId}/status`, {
        delivery_status: status
      });
      return res.data;
    },
    onSuccess: async () => {
      const parcel = selectedParcel; // capture before clearing state

      queryClient.invalidateQueries(["riderParcels"]);
      setIsModalOpen(false);
      setSelectedParcel(null);
      toast.success("Status updated successfully!", {
        position: "top-center",
        duration: 3000,
      });

      // 🧠 Log tracking
      if (parcel) {
        await logTracking({
          trackingId: parcel.trackingId,
          status: "delivered",
          details: `Parcel delivered by ${user.displayName}`,
          location: parcel.receiverServiceCenter, // Make sure this field exists
          updated_by: user.email,
        });
      }
    },

    onError: (error) => {
      console.error("Status update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update status", {
        position: "top-center",
        duration: 4000,
      });
    }
  });

  // Mark as Picked Mutation
  const markPickedMutation = useMutation({
    mutationFn: async (parcel) => {
      // Use parcel._id to call backend
      const res = await axiosSecure.patch(`/parcels/${parcel._id}/pick`);
      return res.data;
    },
    onSuccess: async (data, parcel) => {
      queryClient.invalidateQueries(["riderParcels"]);
      toast.success("Parcel marked as picked!", { position: "top-center", duration: 3000 });

      // Log tracking using the parcel object passed
      if (parcel) {
        await logTracking({
          trackingId: parcel.trackingId,
          status: "picked",
          details: `Parcel picked by ${user.displayName}`,
          location: parcel.senderServiceCenter, // Ensure this exists in parcel data
          updated_by: user.email,
        });
      }
    },
    onError: (error) => {
      console.error("Error marking as picked:", error);
      toast.error(error.response?.data?.message || "Failed to mark as picked. Please try again.", {
        position: "top-center",
        duration: 4000,
      });
    }
  });


  const handleStatusUpdate = (parcel) => {
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = (newStatus) => {
    updateStatusMutation.mutate({
      parcelId: selectedParcel._id,
      status: newStatus,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "on_the_way":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">My Assigned Parcels</h2>
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Failed to load assigned parcels. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Assigned Parcels</h2>

      {pendingParcels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No parcels assigned to you yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            You'll see your delivery tasks here once assigned.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingParcels.map((parcel) => (
            <div
              key={parcel._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{parcel.parcelName}</h3>
                  <p className="text-sm text-gray-600">
                    ID: {parcel.trackingId}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    parcel.delivery_status
                  )}`}
                >
                  {parcel.delivery_status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Sender Info */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    PICKUP FROM:
                  </h4>
                  <p className="font-medium">{parcel.senderName}</p>
                  <p className="text-sm text-gray-600">
                    {parcel.senderContact}
                  </p>
                  <p className="text-sm text-gray-600">
                    {parcel.senderAddress}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {parcel.senderRegion}
                  </p>
                  {parcel.pickupInstruction && (
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Note:</span>{" "}
                      {parcel.pickupInstruction}
                    </p>
                  )}
                </div>

                {/* Receiver Info */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    DELIVER TO:
                  </h4>
                  <p className="font-medium">{parcel.receiverName}</p>
                  <p className="text-sm text-gray-600">
                    {parcel.receiverContact}
                  </p>
                  <p className="text-sm text-gray-600">
                    {parcel.receiverAddress}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    {parcel.receiverRegion}
                  </p>
                  {parcel.deliveryInstruction && (
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Note:</span>{" "}
                      {parcel.deliveryInstruction}
                    </p>
                  )}
                </div>
              </div>

              {/* Parcel Details */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>
                  Weight:{" "}
                  <span className="font-medium">{parcel.weight} kg</span>
                </span>
                <span>
                  Type: <span className="font-medium">{parcel.parcelType}</span>
                </span>
                <span>
                  Cost: <span className="font-medium">৳{parcel.cost}</span>
                </span>
              </div>

              {/* Action Button */}
              {parcel.delivery_status === "assigned" && (
                <button
                  onClick={() => markPickedMutation.mutate(parcel)}  // pass whole parcel object here
                  disabled={markPickedMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-medium"
                >
                  {markPickedMutation.isPending ? "Marking..." : "Mark as Picked"}
                </button>

              )}

              {parcel.delivery_status === "on_the_way" && (
                <button
                  onClick={() => handleStatusUpdate(parcel)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-medium"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      {isModalOpen && selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Update Delivery Status
            </h3>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-medium">{selectedParcel.parcelName}</p>
              <p className="text-sm text-gray-600">
                ID: {selectedParcel.trackingId}
              </p>
              <p className="text-sm text-gray-600">
                To: {selectedParcel.receiverName} (
                {selectedParcel.receiverContact})
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to mark this parcel as delivered?
            </p>

            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setIsModalOpen(false)}
                disabled={updateStatusMutation.isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleConfirmUpdate("delivered")}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Updating...
                  </>
                ) : (
                  "Mark as Delivered"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
