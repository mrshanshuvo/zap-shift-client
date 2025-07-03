import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setSuccess(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Payment successful! Thank you.");
      console.log("[PaymentMethod]", paymentMethod);
    }
    setIsProcessing(false);

    // create-payment-intent
    const res = await axiosSecure.post("/create-payment-intent", {
      amount: parcel.cost,
      parcelId: id,
    });
    console.log('res from payment intent', res);

    if (res.data.clientSecret) {
      const paymentResult = await stripe.confirmCardPayment(res.data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: parcel.senderName,
            email: parcel.senderEmail,
          },
        },
      });
      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setSuccess("Payment successful! Thank you.");
      }
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

        {success && (
          <div className="alert alert-success shadow-sm">
            <span>{success}</span>
          </div>
        )}
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
