import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { isPending, data: parcel = {} } = useQuery({
    queryKey: ["parcel", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${id}`);
      return res.data.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <progress className="progress progress-primary w-56"></progress>
      </div>
    );
  }

  const handlePayment = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    // Step 1: Create Payment Intent
    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: parcel.cost,
        parcelId: id,
      });

      const clientSecret = data.clientSecret;

      // Step 2: Confirm Card Payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || "Unknown",
            email: user?.email || "Unknown",
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setIsProcessing(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        const paymentIntent = paymentResult.paymentIntent;

        // Step 3: Save to DB
        const paymentData = {
          parcelId: id,
          email: user?.email,
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount,
          paymentTime: paymentIntent.created,
          paymentMethod: paymentIntent.payment_method,
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);

        if (paymentRes.data.data.paymentInsertResult.insertedId) {
          // Step 4: Show SweetAlert and Redirect
          queryClient.invalidateQueries(["payment-history", user?.email]);
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `
            <p>Your payment has been completed.</p>
            <p><strong>Transaction ID:</strong> ${paymentIntent.id}</p>
          `,
            confirmButtonText: "Go to My Parcels",
          }).then(() => {
            navigate("/dashboard/myParcels"); // Adjust the route if necessary
          });
        }
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto mt-10 grid lg:grid-cols-2 gap-8 p-6 bg-base-100 rounded-xl shadow-xl">
      {/* Parcel Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">Parcel Summary</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-semibold">Parcel Name:</p>
            <p>{parcel.parcelName}</p>
          </div>
          <div>
            <p className="font-semibold">Weight:</p>
            <p>{parcel.weight} kg</p>
          </div>
          <div>
            <p className="font-semibold">Sender:</p>
            <p>{parcel.senderName} ({parcel.senderContact})</p>
          </div>
          <div>
            <p className="font-semibold">Receiver:</p>
            <p>{parcel.receiverName} ({parcel.receiverContact})</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">From:</p>
            <p>{parcel.senderAddress}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">To:</p>
            <p>{parcel.receiverAddress}</p>
          </div>
          <div>
            <p className="font-semibold">Cost:</p>
            <p className="text-green-600 font-bold">৳ {parcel.cost}</p>
          </div>
          <div>
            <p className="font-semibold">Tracking ID:</p>
            <p className="text-blue-600">{parcel.trackingId}</p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Payment</h2>

        {error && (
          <div className="alert alert-error shadow-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-4 border rounded-md bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#000",
                    "::placeholder": {
                      color: "#a0aec0",
                    },
                  },
                  invalid: {
                    color: "#dc2626",
                  },
                },
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!stripe || !elements || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              `Pay ৳${parcel.cost}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
