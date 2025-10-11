// Payments.jsx - SIMPLIFIED
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Payments({
  familyId,
  amount,
  paymentDetails,
  handleClose,
  paymentType,
  refetch,
}) {
  // ✅ NO useEffect here - no automatic payment intent creation

  const appearance = {
    theme: "stripe",
  };

  return (
    <div>
      {/* ✅ Remove clientSecret condition - render always */}
      <Elements
        stripe={stripePromise}
        options={{
          appearance,
          paymentMethodOrder: ["card"],
          wallets: { applePay: "never", googlePay: "never" },
        }}
      >
        <CheckoutForm
          familyId={familyId}
          amount={amount}
          paymentDetails={paymentDetails}
          handleClose={handleClose}
          paymentType={paymentType}
          refetch={refetch}
        />
      </Elements>
    </div>
  );
}
