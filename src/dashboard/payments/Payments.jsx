import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

export default function Payments() {
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
          console.log(data);
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
    wallets: {
      applePay: "never",
      googlePay: "never",
      link: "never",
    },
  };

  return (
    <div>
      <h2>payments</h2>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm></CheckoutForm>
        </Elements>
      )}
    </div>
  );
}
