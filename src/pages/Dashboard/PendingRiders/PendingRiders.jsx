import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { format, parseISO } from "date-fns";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: riders = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
    staleTime: 60000
  });

  const handleDecision = async (id, decision, email) => {
    const isApproving = decision === "approve";
    const actionText = isApproving ? "approve" : "reject";

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${actionText} this rider`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApproving ? "#3085d6" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${actionText}!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/riders/${id}/status`, {
            status: isApproving ? "approved" : "rejected",
            email,
          });

          if (res.data.modifiedCount > 0) {
            Swal.fire(
              `${isApproving ? "Approved" : "Rejected"}!`,
              `Rider has been ${actionText}d.`,
              "success"
            );
            refetch();
          }
        } catch (err) {
          Swal.fire("Error!", err.message, "error");
        }
      }
    });
  };

  const openModal = (rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRider(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "PP");
    } catch (e) {
      console.error("Invalid date format:", e, dateString);
      return "N/A";
    }
  };

  if (isLoading) return <div className="text-center py-8"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-error">Error: {error.message}</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pending Rider Applications</h2>
        <div className="badge badge-primary">{riders.length} pending</div>
      </div>

      {riders.length === 0 ? (
        <div className="alert alert-info">No pending rider applications found</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th>Name</th>
                <th>Contact</th>
                <th>Vehicle</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id}>
                  <td>
                    <div className="font-medium">{rider.name}</div>
                    <div className="text-sm text-gray-500">{rider.email}</div>
                  </td>
                  <td>{rider.phone}</td>
                  <td>
                    {rider.bikeBrand} ({rider.bikeRegNo})
                  </td>
                  <td>{formatDate(rider.createdAt)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => openModal(rider)}
                      >
                        Details
                      </button>
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => handleDecision(rider._id, "approve", rider.email)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDecision(rider._id, "reject", rider.email)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Rider Application Details</h3>

          {selectedRider && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Personal Information</p>
                  <p><strong>Name:</strong> {selectedRider.name}</p>
                  <p><strong>Email:</strong> {selectedRider.email}</p>
                  <p><strong>Phone:</strong> {selectedRider.phone}</p>
                  <p><strong>Age:</strong> {selectedRider.age}</p>
                </div>
                <div>
                  <p className="font-semibold">Identification</p>
                  <p><strong>NID:</strong> {selectedRider.nid}</p>
                  <p><strong>Region:</strong> {selectedRider.region}</p>
                  <p><strong>District:</strong> {selectedRider.district}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">Vehicle Information</p>
                <p><strong>Brand:</strong> {selectedRider.bikeBrand}</p>
                <p><strong>Registration:</strong> {selectedRider.bikeRegNo}</p>
              </div>

              <div>
                <p className="font-semibold">Additional Information</p>
                <p>{selectedRider.additionalInfo}</p>
              </div>

              <div>
                <p className="font-semibold">Application Details</p>
                <p><strong>Applied On:</strong> {formatDate(selectedRider.createdAt)}</p>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-success"
              onClick={() => {
                handleDecision(selectedRider._id, "approve");
                closeModal();
              }}
            >
              Approve
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                handleDecision(selectedRider._id, "reject");
                closeModal();
              }}
            >
              Reject
            </button>
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PendingRiders;