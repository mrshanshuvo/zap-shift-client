import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { format, parseISO } from 'date-fns';
import Swal from 'sweetalert2';

const ApprovedRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRider, setSelectedRider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: riders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['approvedRiders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders/approved');
      return res.data;
    }
  });

  const handleDeactivate = async (id) => {
    Swal.fire({
      title: 'Deactivate Rider?',
      text: "This rider will no longer be able to access the system",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, deactivate!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/riders/${id}/status`, {
            status: 'inactive'
          });

          if (res.data.modifiedCount > 0) {
            Swal.fire(
              'Deactivated!',
              'Rider has been deactivated.',
              'success'
            );
            refetch();
          }
        } catch (err) {
          Swal.fire('Error!', err.message, 'error');
        }
      }
    });
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'PPpp');
    } catch {
      return 'N/A';
    }
  };

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.phone.includes(searchTerm)
  );

  if (isLoading) return <div className="text-center py-8"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-error">Error loading riders</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Approved Riders</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="badge badge-success">{filteredRiders.length} active</div>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="input input-bordered w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRiders.length === 0 ? (
        <div className="alert alert-info">
          {searchTerm ? 'No matching riders found' : 'No approved riders found'}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table">
            <thead>
              <tr className="bg-gray-100">
                <th>Rider Info</th>
                <th>Contact</th>
                <th>Vehicle</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.map((rider) => (
                <tr key={rider._id}>
                  <td>
                    <div className="font-medium">{rider.name}</div>
                    <div className="text-sm text-gray-500">NID: {rider.nid}</div>
                    <div className="text-sm">Age: {rider.age}</div>
                  </td>
                  <td>
                    <div>{rider.phone}</div>
                    <div className="text-sm text-gray-500">{rider.email}</div>
                  </td>
                  <td>
                    <div className="font-medium">{rider.bikeBrand}</div>
                    <div className="text-sm">Reg: {rider.bikeRegNo}</div>
                  </td>
                  <td>
                    <div>{rider.district}</div>
                    <div className="text-sm text-gray-500">{rider.region}</div>
                  </td>
                  <td>
                    <span className="badge badge-success">Approved</span>
                    <div className="text-xs mt-1">
                      Since: {formatDate(rider.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedRider(rider);
                          setIsModalOpen(true);
                        }}
                        className="btn btn-xs btn-info"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDeactivate(rider._id)}
                        className="btn btn-xs btn-error"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rider Details Modal */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">
            Rider Details: {selectedRider?.name}
          </h3>

          {selectedRider && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Personal Information</p>
                  <p><strong>Name:</strong> {selectedRider.name}</p>
                  <p><strong>Email:</strong> {selectedRider.email}</p>
                  <p><strong>Phone:</strong> {selectedRider.phone}</p>
                  <p><strong>Age:</strong> {selectedRider.age}</p>
                  <p><strong>NID:</strong> {selectedRider.nid}</p>
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p><strong>Region:</strong> {selectedRider.region}</p>
                  <p><strong>District:</strong> {selectedRider.district}</p>
                  <p className="font-semibold mt-2">Status</p>
                  <p>
                    <span className="badge badge-success">
                      {selectedRider.status}
                    </span>
                  </p>
                  <p><strong>Since:</strong> {formatDate(selectedRider.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">Vehicle Information</p>
                <p><strong>Brand:</strong> {selectedRider.bikeBrand}</p>
                <p><strong>Registration:</strong> {selectedRider.bikeRegNo}</p>
              </div>

              <div>
                <p className="font-semibold">Additional Information</p>
                <p className="whitespace-pre-line">{selectedRider.additionalInfo}</p>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={() => {
                handleDeactivate(selectedRider?._id);
                setIsModalOpen(false);
              }}
            >
              Deactivate Rider
            </button>
            <button className="btn" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ApprovedRiders;