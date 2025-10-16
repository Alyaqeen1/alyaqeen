import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSearchParams } from "react-router";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  // Gradient styles matching your theme
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  useEffect(() => {
    // You can verify the setup intent status here if needed
    if (sessionId) {
      console.log("Setup completed for session:", sessionId);
      // Optionally: Update your backend that setup was successful
    }
  }, [sessionId]);

  return (
    <div
      className="rounded-4 border-0 shadow overflow-hidden mx-auto"
      style={{
        background: "white",
        maxWidth: "800px",
        margin: "2rem auto",
      }}
    >
      {/* Header with Gradient */}
      <div style={gradientStyle} className="text-white p-4">
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
            <span style={{ fontSize: "2rem" }}>✅</span>
          </div>

          <div className="flex-grow-1">
            <h1
              className="mb-1 fw-bold text-white"
              style={{
                fontSize: "1.8rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Direct Debit Setup Complete!
            </h1>
            <p
              className="mb-0 opacity-90"
              style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
            >
              Your automatic payments are now configured
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 text-center">
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

        <h3 className="fw-bold text-dark mb-3">Successfully Set Up!</h3>

        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="text-start">
              <h5 className="fw-semibold text-dark mb-3">What happens next?</h5>
              <ul className="list-unstyled">
                <li className="mb-2 d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span>Your Direct Debit mandate has been set up</span>
                </li>
                <li className="mb-2 d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span>
                    Future monthly fees will be collected automatically
                  </span>
                </li>
                <li className="mb-2 d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span>
                    You'll receive email notifications before each payment
                  </span>
                </li>
                <li className="d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span>
                    You can manage your payment method in your dashboard
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="d-grid gap-3 d-md-flex justify-content-center">
          <Link
            to="/dashboard/parent/pay-monthly-fees"
            className="btn text-white fw-semibold px-5 py-3 rounded-3 border-0"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              fontSize: "1.1rem",
              minWidth: "200px",
            }}
          >
            Back to Fees
          </Link>

          <Link
            to="/dashboard"
            className="btn btn-outline-secondary px-4 py-3"
            style={{
              borderColor: "#667eea",
              color: "#667eea",
              minWidth: "150px",
            }}
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-4">
          <p className="small text-muted">
            If you have any questions about your Direct Debit setup, please
            contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
