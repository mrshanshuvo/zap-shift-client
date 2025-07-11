import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import moment from "moment";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: paymentHistoryRaw, isLoading, error } = useQuery({
    enabled: !!user?.email,
    queryKey: ["payment-history", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return Array.isArray(res.data.data) ? res.data.data : [];
    },
  });

  const paymentHistory = paymentHistoryRaw || [];

  if (isLoading) return <div>Loading payment history...</div>;
  if (error) return <div>Error loading payment history</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Amount (৳)</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Payment Method</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Paid At</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-100">
              <td className="px-4 py-2 text-sm text-gray-700">{payment.transactionId}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{payment.amount}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{payment.paymentMethod}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {moment(payment.paid_at).format("MMM D, YYYY h:mm A")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
