import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

export default function Payments({
  familyId,
  amount,
  paymentDetails,
  handleClose,
  paymentType,
  refetch,
}) {
  const axiosPublic = useAxiosPublic();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const [clientSecret, setClientSecret] = useState("");
  const price = 100;
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axiosPublic.post("/create-payment-intent", {
          price,
        });
        if (data) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);
  const appearance = {
    theme: "stripe",
  };
  // const options = {
  //   clientSecret,
  //   appearance,
  // };

  const options = {
    clientSecret,
    appearance,
    paymentMethodOrder: ["card"], // Only show credit cards
    wallets: {
      applePay: "never",
      googlePay: "never",
    },
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            familyId={familyId}
            amount={amount}
            paymentDetails={paymentDetails}
            handleClose={handleClose}
            paymentType={paymentType}
            refetch={refetch}
          ></CheckoutForm>
        </Elements>
      )}
    </div>
  );
}
