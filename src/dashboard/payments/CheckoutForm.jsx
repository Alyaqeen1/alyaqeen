import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import "./CheckoutForm.css";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useUpdateStudentStatusMutation } from "../../redux/features/students/studentsApi";
import { useCreateFeeDataMutation } from "../../redux/features/fees/feesApi";

const CheckoutForm = ({
  familyId,
  amount = 0,
  handleClose,
  paymentType,
  paymentDetails = [],
  refetch,
}) => {
  const { user } = useAuth();
  const [createFeeData] = useCreateFeeDataMutation();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const axiosPublic = useAxiosPublic();
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);

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

    try {
      const { data } = await axiosPublic.post("/create-payment-intent", {
        price: amount,
      });

      const clientSecret = data.clientSecret;

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
            expectedTotal: amount,
            remaining: 0,
            status: "paid",
            paymentType,
            timestamp: new Date().toISOString(),
          };

          let paymentData = { ...basePaymentData };

          if (paymentType === "admission") {
            paymentData = {
              ...paymentData,
              students: paymentDetails?.map((student) => ({
                studentId: student.studentId,
                name: student.name,
                admissionFee: student.admissionFee,
                monthlyFee: student.monthlyFee,
                discountedFee: student.monthlyFee, // ✅ Add discountedFee
                joiningMonth: student.joiningMonth.toString().padStart(2, "0"), // ✅ Format as "09"
                joiningYear: student.joiningYear,

                subtotal: student.admissionFee, // ✅ Only admission fee for subtotal
              })),
              payments: [
                // ✅ Root payments with transactionId
                {
                  amount: amount,
                  method: "instant",
                  date: new Date().toISOString().split("T")[0],
                  transactionId: paymentIntent.id, // ✅ Only here
                },
              ],
            };
          } else if (paymentType === "monthly") {
            // Monthly section unchanged - working fine
            paymentData = {
              ...paymentData,
              students: paymentDetails,
              payments: [
                {
                  amount: amount,
                  method: "instant",
                  date: new Date().toISOString().split("T")[0],
                  transactionId: paymentIntent.id,
                },
              ],
            };
          }

          const data = await createFeeData(paymentData).unwrap();

          if (data.insertedId) {
            toast.success("Payment successful!");
            refetch();
          }

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

            const notification = {
              type: "admission",
              message: `${user?.displayName} Paid Admission Fee.`,
              isRead: false,
              createdAt: new Date(),
              link: "/dashboard/online-admissions",
            };

            await axiosPublic.post("/notifications", notification);
          }
        } catch (error) {
          console.error("Payment processing error:", error);
          toast.error("Payment succeeded, but further processing failed.");
        } finally {
          setProcessing(false);
          handleClose?.();
        }
      } else {
        toast.error("Payment failed.");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Payment failed to initialize.");
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
          disabled={!stripe || processing}
        >
          {processing ? "Processing..." : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
