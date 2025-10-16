import React from "react";
import { Link } from "react-router";

export default function PaymentCancel() {
  const gradientStyle = {
    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
  };

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
            <span style={{ fontSize: "2rem" }}>❌</span>
          </div>

          <div className="flex-grow-1">
            <h1
              className="mb-1 fw-bold text-white"
              style={{
                fontSize: "1.8rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Setup Cancelled
            </h1>
            <p
              className="mb-0 opacity-90"
              style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
            >
              Your Direct Debit setup was not completed
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
            background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
            color: "white",
            fontSize: "2.5rem",
          }}
        >
          ✕
        </div>

        <h3 className="fw-bold text-dark mb-3">Setup Incomplete</h3>
        <p className="text-muted mb-4">
          You can set up Direct Debit at any time from your payment options.
          Your monthly fees will need to be paid manually until you complete the
          setup.
        </p>

        <div className="d-grid gap-3 d-md-flex justify-content-center">
          <Link
            to="/dashboard/parent/pay-by-direct-debit"
            className="btn text-white fw-semibold px-5 py-3 rounded-3 border-0"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              textShadow: "0 1px 1px rgba(0,0,0,0.2)",
              fontSize: "1.1rem",
              minWidth: "200px",
            }}
          >
            Try Again
          </Link>

          <Link
            to="/dashboard/parent/pay-monthly-fees"
            className="btn btn-outline-secondary px-4 py-3"
            style={{
              borderColor: "#667eea",
              color: "#667eea",
              minWidth: "150px",
            }}
          >
            Other Payment Options
          </Link>
        </div>
      </div>
    </div>
  );
}
