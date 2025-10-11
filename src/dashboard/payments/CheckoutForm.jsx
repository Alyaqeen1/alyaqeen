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
  paymentDetails = [], // extra dynamic data per payment type
  refetch,
}) => {
  const { user } = useAuth();
  const [createFeeData] = useCreateFeeDataMutation();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const axiosPublic = useAxiosPublic();
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);

  // ✅ Create payment intent ONLY when form is submitted
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
      // ✅ STEP 1: Create payment intent ONLY when user clicks pay
      const { data } = await axiosPublic.post("/create-payment-intent", {
        price: amount,
      });

      const clientSecret = data.clientSecret;

      // ✅ STEP 2: Confirm payment with the created intent
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
          // FIXED: Base payment data matches your target structure
          const basePaymentData = {
            familyId,
            name: user?.displayName,
            email: user?.email,
            expectedTotal: amount, // FIX: Use expectedTotal instead of amount
            remaining: 0, // FIX: Add remaining field
            status: "paid",
            paymentType,
            timestamp: new Date().toISOString(), // FIX: Use timestamp instead of date
            transactionId: paymentIntent.id,
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
                joiningMonth: student.joiningMonth,
                joiningYear: student.joiningYear,
              })),
              payments: [
                // FIX: Add payments array for admission too
                {
                  amount: amount,
                  method: "instant",
                  date: new Date().toISOString().split("T")[0],
                  transactionId: paymentIntent.id,
                },
              ],
            };
          } else if (paymentType === "monthly") {
            // FIXED: This is now correct - paymentDetails already has monthsPaid
            paymentData = {
              ...paymentData,
              students: paymentDetails, // ✅ This already has the correct structure with monthsPaid
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
          disabled={!stripe || processing} // ✅ Remove clientSecret dependency
        >
          {processing ? "Processing..." : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
