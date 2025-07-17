import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { FaUser, FaUserCheck } from "react-icons/fa";
import Swal from "sweetalert2";


const MakeAdmins = () => {
  const SUPER_ADMIN_EMAIL = "shahidhasanshovu@gmail.com";
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { loading: authLoading } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedEmail(searchText.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  // Check if current user is an admin
  // const { data: loggedUser, isLoading: roleLoading } = useQuery({
  //   queryKey: ["loggedUser", authUser?.email],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(`/users/search?email=${authUser.email}`);
  //     return res.data[0]; // response is an array
  //   },
  //   enabled: !!authUser?.email,
  // });

  // const isAdmin = loggedUser?.role === "admin" || "superAdmin";

  // Search users by email
  const {
    data: matchedUsers = [],
    isLoading: isSearchLoading,
  } = useQuery({
    queryKey: ["searchUsers", debouncedEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${debouncedEmail}`);
      return res.data;
    },
    enabled: !!debouncedEmail,
  });


  // Role update mutation
  const { mutate: updateRole, isLoading: isUpdating } = useMutation({
    mutationFn: ({ email, role }) =>
      axiosSecure.patch(`/users/${email}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["searchUsers", debouncedEmail]);
    },
  });

  const getRoleBadge = (role) =>
    role === "admin" ? (
      <div className="badge badge-info gap-1"><FaUserCheck /> Admin</div>
    ) : (
      <div className="badge badge-ghost gap-1"><FaUser /> User</div>
    );

  if (authLoading) {
    return (
      <div className="text-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // if (!isAdmin) {
  //   return (
  //     <div className="text-center text-red-500 font-semibold mt-10">
  //       🔒 Access denied. Only Admins can manage roles.
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>

      <input
        type="email"
        placeholder="Search users by email"
        className="input input-bordered w-full mb-4"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {isSearchLoading ? (
        <div className="text-center py-4">
          <span className="loading loading-spinner"></span>
        </div>
      ) : matchedUsers.length === 0 && debouncedEmail ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        matchedUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {matchedUsers.map((user) => (
                  <tr key={user.email}>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      {user.email === SUPER_ADMIN_EMAIL ? (
                        <span className="text-gray-400 text-sm">Super Admin (Locked)</span>
                      ) : isUpdating ? (
                        <button className="btn btn-sm" disabled>
                          <span className="loading loading-spinner loading-sm"></span>
                        </button>
                      ) : user.role === "admin" ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "You are about to remove admin access.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, remove admin",
                              cancelButtonText: "Cancel",
                            });

                            if (result.isConfirmed) {
                              updateRole({ email: user.email, role: "user" });
                            }
                          }}
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "You are about to make this user an admin.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, make admin",
                              cancelButtonText: "Cancel",
                            });

                            if (result.isConfirmed) {
                              updateRole({ email: user.email, role: "admin" });
                            }
                          }}
                        >
                          Make Admin
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default MakeAdmins;
