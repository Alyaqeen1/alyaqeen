import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import {
  useCancelFamilyDebitMutation,
  useGetAllFullFamilyQuery,
  useGetFamilyDebitQuery,
} from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function PayByDirectDebit() {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ RTK Queries
  const { data: family, isLoading: familyLoading } = useGetAllFullFamilyQuery(
    user?.email,
    {
      skip: !user?.email,
    }
  );

  const familyId = family?._id;

  const {
    data: directDebitData,
    isLoading: debitLoading,
    refetch: refetchDirectDebit,
  } = useGetFamilyDebitQuery(familyId, {
    skip: !familyId,
    pollingInterval: 30000, // Auto-refresh every 30 seconds for pending status
  });

  const [cancelFamilyDebit, { isLoading: isCancelling }] =
    useCancelFamilyDebitMutation();

  const [isManaging, setIsManaging] = useState(false);
  const [preferredDate, setPreferredDate] = useState(""); // Default to 1st

  // ✅ Use data from RTK Query instead of local state
  const hasExistingSetup = directDebitData?.hasDirectDebit || false;
  const paymentMethod = directDebitData?.directDebit || null;
  const isPendingAuthorization =
    directDebitData?.directDebit?.status === "pending";
  const mandateStatus = directDebitData?.directDebit?.mandateStatus;
  const setupDate = directDebitData?.directDebit?.setupDate;

  // Check if we're in management mode
  useEffect(() => {
    if (location.state?.manage) {
      setIsManaging(true);
    }
  }, [location]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBacsPayment = async () => {
    try {
      // Validate preferred date is selected
      if (!preferredDate) {
        toast.error("Please select your preferred payment date first");
        return;
      }

      // Store familyId for the success page
      const { data } = await axiosPublic.post("/create-bacs-checkout-session", {
        email: user?.email,
        name: family?.name,
        familyId: familyId,
        preferredPaymentDate: preferredDate, // Send preferred date to backend
      });
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment setup failed:", error);
      Swal.fire("Error!", "Failed to start payment setup.", "error");
    }
  };

  const handleCancelDirectDebit = async () => {
    const result = await Swal.fire({
      title: "Cancel Direct Debit?",
      text: "Are you sure you want to cancel your Direct Debit setup?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const result = await cancelFamilyDebit(familyId).unwrap();

        // ✅ RTK will automatically refetch getFamilyDebit due to invalidatesTags
        if (result?.success) {
          Swal.fire(
            "Cancelled!",
            "Your Direct Debit has been cancelled.",
            "success"
          );
          // Optional: Navigate back after cancellation
          navigate("/dashboard/parent/pay-monthly-fees");
        }
      } catch (error) {
        console.error("Cancellation failed:", error);
        Swal.fire("Error!", "Failed to cancel Direct Debit.", "error");
      }
    }
  };

  const handleRefreshStatus = () => {
    refetchDirectDebit();
    Swal.fire({
      title: "Refreshing Status",
      text: "Checking for updates...",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleBack = () => {
    if (location.state?.fromFeesPage) {
      navigate(-1);
    } else {
      navigate("/dashboard/parent/pay-monthly-fees");
    }
  };

  // Gradient styles
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const successGradient = {
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  };

  const pendingGradient = {
    background: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
  };

  if (familyLoading || debitLoading) {
    return <LoadingSpinnerDash />;
  }

  // Show different UI based on status
  if (isPendingAuthorization) {
    return (
      <div
        className="rounded-4 border-0 shadow overflow-hidden mx-auto"
        style={{
          background: "white",
          margin: "2rem auto",
        }}
      >
        {/* Header with Pending Gradient */}
        <div style={pendingGradient} className="text-white p-4">
          <div className="d-flex align-items-center flex-wrap gap-4">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle border"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.3) !important",
              }}
            >
              <span style={{ fontSize: "2rem" }}>⏳</span>
            </div>

            <div className="flex-grow-1">
              <h1
                className="mb-1 fw-bold text-white"
                style={{
                  fontSize: "1.8rem",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                Direct Debit Pending Authorization
              </h1>
              <p
                className="mb-0 opacity-90"
                style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
              >
                Your Direct Debit setup is being verified by your bank
              </p>
            </div>

            <div className="d-flex flex-column gap-2">
              <span
                className="px-3 py-1 rounded-pill text-uppercase fw-bold"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                }}
              >
                Processing
              </span>
              <span
                className="px-3 py-1 rounded-pill text-uppercase fw-bold text-white"
                style={{
                  background: "rgba(255, 216, 155, 0.8)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                }}
              >
                Verification Required
              </span>
            </div>
          </div>
        </div>

        {/* Pending Authorization Content */}
        <div className="p-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "120px",
                    height: "120px",
                    background: "linear-gradient(135deg, #ffd89b, #19547b)",
                    color: "white",
                    fontSize: "3rem",
                    animation: "pulse 2s infinite",
                  }}
                >
                  ⏳
                </div>

                <h3 className="fw-bold text-warning mb-3">
                  Authorization in Progress
                </h3>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-6 mb-3">
                        <p className="mb-1">
                          <strong>Current Status</strong>
                        </p>
                        <span className="badge bg-warning text-dark fs-6">
                          {mandateStatus || "Pending"}
                        </span>
                      </div>
                      <div className="col-md-6 mb-3">
                        <p className="mb-1">
                          <strong>Setup Date</strong>
                        </p>
                        <p className="text-muted mb-0">
                          {setupDate ? formatDate(setupDate) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info border-0 mb-4">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-info-circle me-3 fs-4 text-info"></i>
                    <div className="text-start">
                      <h6 className="alert-heading mb-2">
                        What's happening now?
                      </h6>
                      <p className="mb-2">
                        Your bank is verifying the Direct Debit mandate. This
                        process typically takes{" "}
                        <strong>2-3 business days</strong>.
                      </p>
                      <p className="mb-0">
                        You'll receive a confirmation email once your Direct
                        Debit is fully activated and ready for payments.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="fw-bold mb-4 text-center">Setup Progress</h5>
                    <div className="row align-items-center">
                      <div className="col-4 text-center">
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: "50px",
                            height: "50px",
                            background:
                              "linear-gradient(135deg, #43e97b, #38f9d7)",
                            color: "white",
                          }}
                        >
                          ✓
                        </div>
                        <p className="small fw-bold mb-0">Setup Complete</p>
                      </div>
                      <div className="col-4 text-center">
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: "50px",
                            height: "50px",
                            background:
                              "linear-gradient(135deg, #ffd89b, #19547b)",
                            color: "white",
                          }}
                        >
                          ⏳
                        </div>
                        <p className="small fw-bold mb-0">Bank Verification</p>
                        <p className="small text-muted">Current Step</p>
                      </div>
                      <div className="col-4 text-center">
                        <div
                          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: "50px",
                            height: "50px",
                            background: "#e9ecef",
                            color: "#6c757d",
                          }}
                        >
                          ✓
                        </div>
                        <p className="small fw-bold mb-0 text-muted">
                          Ready to Use
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-3 d-md-flex justify-content-center">
                  <button
                    onClick={handleRefreshStatus}
                    className="btn btn-primary px-4 py-3"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none",
                      minWidth: "200px",
                    }}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh Status
                  </button>

                  <button
                    className="btn btn-outline-danger px-4 py-3"
                    onClick={handleCancelDirectDebit}
                    style={{
                      minWidth: "200px",
                    }}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times me-2"></i>
                        Cancel Setup
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-outline-secondary px-4 py-3"
                    onClick={handleBack}
                    style={{
                      minWidth: "150px",
                    }}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Options
                  </button>
                </div>

                <div className="mt-4">
                  <p className="small text-muted">
                    <i className="fas fa-clock me-1"></i>
                    Status updates automatically every 30 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add pulsing animation */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="rounded-4 border-0 shadow overflow-hidden mx-auto"
      style={{
        background: "white",
        margin: "2rem auto",
      }}
    >
      {/* Header with Conditional Gradient */}
      <div
        style={hasExistingSetup ? successGradient : gradientStyle}
        className="text-white p-4"
      >
        <div className="d-flex align-items-center flex-wrap gap-4">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle border"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3) !important",
            }}
          >
            <span style={{ fontSize: "2rem" }}>
              {hasExistingSetup ? "✅" : "💳"}
            </span>
          </div>

          <div className="flex-grow-1">
            <h1
              className="mb-1 fw-bold text-white"
              style={{
                fontSize: "1.8rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {hasExistingSetup
                ? "Direct Debit Active"
                : isManaging
                ? "Manage Direct Debit"
                : "Set Up Direct Debit"}
            </h1>
            <p
              className="mb-0 opacity-90"
              style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
            >
              {hasExistingSetup
                ? "Your automatic payments are configured"
                : "Secure automatic monthly payments for your tuition fees"}
            </p>
          </div>

          <div className="d-flex flex-column gap-2">
            <span
              className="px-3 py-1 rounded-pill text-uppercase fw-bold"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontSize: "0.8rem",
                letterSpacing: "0.5px",
                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              {hasExistingSetup ? "Active" : "Secure"}
            </span>
            <span
              className="px-3 py-1 rounded-pill text-uppercase fw-bold text-white"
              style={{
                background: hasExistingSetup ? "#43e97b" : "#667eea",
                fontSize: "0.8rem",
                letterSpacing: "0.5px",
                textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              }}
            >
              {hasExistingSetup ? "Automatic" : "Convenient"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {hasExistingSetup ? (
          // EXISTING SETUP VIEW
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                    color: "white",
                    fontSize: "2.5rem",
                  }}
                >
                  ✓
                </div>
                <h3 className="fw-bold text-success mb-3">
                  Direct Debit Active
                </h3>
                <p className="text-muted">
                  Your monthly fees will be automatically collected via Direct
                  Debit.
                </p>

                {paymentMethod && (
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="fw-bold mb-3">Payment Method Details</h5>
                      <div className="row text-start">
                        <div className="col-md-6">
                          <p>
                            <strong>Bank:</strong> {paymentMethod.bankName}
                          </p>
                          <p>
                            <strong>Account:</strong> ****{paymentMethod.last4}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p>
                            <strong>Status:</strong>{" "}
                            <span className="text-success">Active</span>
                          </p>
                          <p>
                            <strong>Setup Date:</strong>{" "}
                            {new Date(
                              paymentMethod.setupDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-grid gap-3 d-md-flex justify-content-center">
                  {/* <button
                    onClick={handleUpdateBacsPayment}
                    className="btn btn-outline-primary px-4 py-3"
                    style={{
                      borderColor: "#667eea",
                      color: "#667eea",
                      minWidth: "200px",
                    }}
                    disabled={isCancelling}
                  >
                    Update Payment Method
                  </button> */}

                  <button
                    className="btn btn-outline-danger px-4 py-3"
                    onClick={handleCancelDirectDebit}
                    style={{
                      minWidth: "200px",
                    }}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Direct Debit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // NEW SETUP VIEW
          <div className="row g-4">
            {/* Preferred Payment Date Section - ADDED THIS */}
            <div className="col-12">
              <div className="card shadow border-0 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3 text-dark">
                    Select Preferred Payment Date
                  </h5>
                  <p className="text-muted mb-3">
                    Choose which day of the month you'd like your payments to be
                    collected (1st-7th)
                  </p>

                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <select
                        value={preferredDate}
                        onChange={(e) =>
                          setPreferredDate(parseInt(e.target.value))
                        }
                        className="form-select form-select-lg"
                        style={{
                          border: "2px solid #667eea",
                          borderRadius: "8px",
                          padding: "12px",
                          fontSize: "1rem",
                        }}
                      >
                        <option value="">
                          Select Your Preferred Date for Payment Collection
                        </option>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <option key={day} value={day}>
                            {day}
                            {day === 1
                              ? "st"
                              : day === 2
                              ? "nd"
                              : day === 3
                              ? "rd"
                              : "th"}{" "}
                            of each month
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <div className="alert alert-info border-0 mb-0">
                        <small>
                          <i className="fas fa-info-circle me-2"></i>
                          Your payment will be automatically collected on the{" "}
                          {preferredDate}
                          {preferredDate === 1
                            ? "st"
                            : preferredDate === 2
                            ? "nd"
                            : preferredDate === 3
                            ? "rd"
                            : "th"}{" "}
                          of each month
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Setup Button Section */}
            <div className="col-12">
              <div className="text-center">
                <div className="card shadow border-0">
                  <div className="card-body p-5">
                    <h4 className="mb-4 text-dark">
                      Ready to Set Up Direct Debit?
                    </h4>
                    <p className="text-muted mb-4">
                      You'll be redirected to Stripe to securely set up your
                      Direct Debit mandate. This takes just 2-3 minutes.
                    </p>

                    <div className="d-grid gap-3 d-md-flex justify-content-md-center align-items-center">
                      <button
                        onClick={handleBacsPayment}
                        className="btn text-white fw-semibold px-5 py-3 rounded-3 border-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea, #764ba2)",
                          textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                          fontSize: "1.1rem",
                          minWidth: "250px",
                        }}
                      >
                        Set Up Direct Debit
                      </button>

                      <button
                        className="btn btn-outline-secondary px-4 py-3"
                        onClick={handleBack}
                        style={{
                          borderColor: "#667eea",
                          color: "#667eea",
                          minWidth: "150px",
                        }}
                      >
                        Back to Options
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="small text-muted">
                        <i className="fas fa-lock me-1"></i>
                        Your bank details are processed securely by Stripe and
                        are never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section - FILLED CONTENT */}
            <div className="col-12">
              <div
                className="rounded-4 p-4 mb-4"
                style={{ background: "#f8f9fa" }}
              >
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "white",
                      fontSize: "1.2rem",
                    }}
                  >
                    ✅
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1 text-dark">
                      Why Choose Direct Debit?
                    </h4>
                    <p className="text-muted mb-0">
                      Hassle-free automatic payments
                    </p>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6 col-lg-3">
                    <div className="text-center p-3">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #43e97b, #38f9d7)",
                          color: "white",
                          fontSize: "1.5rem",
                        }}
                      >
                        ⏰
                      </div>
                      <h6 className="fw-bold">Never Miss a Payment</h6>
                      <p className="text-muted small mb-0">
                        Automatic payments ensure your fees are always paid on
                        time
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <div className="text-center p-3">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          fontSize: "1.5rem",
                        }}
                      >
                        🔒
                      </div>
                      <h6 className="fw-bold">Secure & Protected</h6>
                      <p className="text-muted small mb-0">
                        Bank-level security with Stripe processing
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <div className="text-center p-3">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #f093fb, #f5576c)",
                          color: "white",
                          fontSize: "1.5rem",
                        }}
                      >
                        💰
                      </div>
                      <h6 className="fw-bold">Save Time</h6>
                      <p className="text-muted small mb-0">
                        No more manual payments each month
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <div className="text-center p-3">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          background:
                            "linear-gradient(135deg, #ffd89b, #19547b)",
                          color: "white",
                          fontSize: "1.5rem",
                        }}
                      >
                        🔔
                      </div>
                      <h6 className="fw-bold">Payment Notifications</h6>
                      <p className="text-muted small mb-0">
                        Get notified before each payment is processed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section - FILLED CONTENT */}
            <div className="col-12">
              <div
                className="rounded-4 p-4 mb-4"
                style={{ background: "#f8f9fa" }}
              >
                <div className="d-flex align-items-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #f093fb, #f5576c)",
                      color: "white",
                      fontSize: "1.2rem",
                    }}
                  >
                    🔄
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1 text-dark">
                      How Direct Debit Works
                    </h4>
                    <p className="text-muted mb-0">Simple setup process</p>
                  </div>
                </div>

                <div className="row text-center">
                  <div className="col-md-4 mb-4">
                    <div className="position-relative">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          fontSize: "1.5rem",
                          border: "4px solid white",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span className="fw-bold">1</span>
                      </div>
                      <h6 className="fw-bold text-dark">Set Up</h6>
                      <p className="text-muted small">
                        Provide your bank details securely through Stripe
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4 mb-4">
                    <div className="position-relative">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #43e97b, #38f9d7)",
                          color: "white",
                          fontSize: "1.5rem",
                          border: "4px solid white",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span className="fw-bold">2</span>
                      </div>
                      <h6 className="fw-bold text-dark">Authorize</h6>
                      <p className="text-muted small">
                        Authorize automatic payments from your account
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4 mb-4">
                    <div className="position-relative">
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #ffd89b, #19547b)",
                          color: "white",
                          fontSize: "1.5rem",
                          border: "4px solid white",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span className="fw-bold">3</span>
                      </div>
                      <h6 className="fw-bold text-dark">Relax</h6>
                      <p className="text-muted small">
                        Fees are paid automatically each month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
