import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import "./CheckoutForm.css";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useUpdateStudentStatusMutation } from "../../redux/features/students/studentsApi";

const CheckoutForm = ({
  familyId,
  amount = 0,
  handleClose,
  paymentType,
  paymentDetails = [], // extra dynamic data per payment type
  refetch,
}) => {
  const { user } = useAuth();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
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
        const basePaymentData = {
          familyId,
          name: user?.displayName,
          email: user?.email,
          amount,
          status: "paid",
          date: new Date().toISOString(),
          method: "instant", // You can pass this as a prop too if you want to support "bank transfer"
          transactionId: paymentIntent.id,
          paymentType,
        };

        // Merge dynamic values based on type
        let paymentData = { ...basePaymentData };

        if (paymentType === "admission") {
          paymentData = {
            ...paymentData,
            status: "paid",
            students: paymentDetails?.map((student) => ({
              studentId: student.studentId,
              name: student.name,
              admissionFee: student.admissionFee,
              monthlyFee: student.monthlyFee,
              joiningMonth: student.joiningMonth,
              joiningYear: student.joiningYear,
            })),
          };
        } else if (paymentType === "monthly") {
          paymentData = {
            ...paymentData,
            students: paymentDetails, // [{ uid, monthsPaid: [{month, year}] }]
          };
        }

        const { data } = await axiosPublic.post("/fees", paymentData);

        // ✅ 1. Save payment and show toast
        if (data.insertedId) {
          toast.success("Payment successful!");
          refetch();
        }

        // ✅ 2. Extra logic for admission payments
        if (paymentType === "admission") {
          const updatePromises = paymentDetails.map((student) =>
            updateStudentStatus({ id: student.studentId, status: "enrolled" })
              .unwrap()
              .catch((err) => {
                console.error(`Update failed for ${student.name}`, err);
                return null;
              })
          );
          const results = await Promise.allSettled(updatePromises);
          // You can optionally handle or log the results here

          const notification = {
            type: "admission",
            message: `${user?.displayName} Paid Admission Fee.`,
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
