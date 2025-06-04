import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import "./CheckoutForm.css";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const CheckoutForm = ({
  uid,
  amount = 0,
  handleClose,
  paymentType,
  refetch,
}) => {
  const { user } = useAuth();
  // const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  // Step 1: Create Payment Intent when amount is set
  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount]);

  const createPaymentIntent = async () => {
    try {
      const response = await axiosPublic.post("/create-payment-intent", {
        price: amount,
      });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  // Step 2: Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card input not found.");
      setProcessing(false);
      return;
    }

    const { error: methodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (methodError) {
      toast.error(methodError.message);
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || "Anonymous",
            email: user?.email || "unknown@example.com",
          },
        },
      });

    if (confirmError) {
      toast.error(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        const paymentData = {
          uid,
          name: user?.displayName,
          email: user?.email,
          amount,
          date: new Date().toISOString(),
          transactionId: paymentIntent.id,
          paymentType, // add this for backend records if needed
        };

        const { data } = await axiosPublic.post("/fees", paymentData);

        // ✅ 1. Save payment and show toast
        if (data.insertedId) {
          toast.success("Payment successful!");
          refetch();
        }

        // ✅ 2. Extra logic for admission payments
        if (paymentType === "admission") {
          await axiosPublic.patch(`/students/${uid}`, {
            status: "enrolled",
          });

          const notification = {
            type: "admission",
            message: `${user?.displayName} Payed Admission Fee.`,
            isRead: false,
            createdAt: new Date(),
            link: "/dashboard/online-admissions",
          };

          // Optionally call backend to send email/WhatsApp
          await axiosPublic.post("/notifications", notification);
        }
      } catch (error) {
        toast.error("Payment succeeded, but further processing failed.");
      } finally {
        setProcessing(false);
        handleClose?.();
      }
    } else {
      toast.error("Payment failed.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label">Card Details:</label>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <div className="flex justify-end mt-4">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? "Processing..." : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
