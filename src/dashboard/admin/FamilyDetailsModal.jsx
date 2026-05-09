import React from "react";

const FamilyDetailsModal = ({
  show,
  handleClose,
  families,
  title,
  type,
  themeColors,
  getBgColor,
}) => {
  const handleBackdropClick = (event) => {
    if (event.target.classList.contains("modal-backdrop")) {
      handleClose();
    }
  };

  if (!show) return null;

  const statusColor = {
    paid: themeColors.success,
    partial: themeColors.warning,
    unpaid: themeColors.danger,
  };

  return (
    <div>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
        }}
        onClick={handleBackdropClick}
      ></div>

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleBackdropClick}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: `1px solid ${themeColors.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: themeColors.textMuted,
                    margin: "4px 0 0 0",
                  }}
                >
                  Total: {families.length} families
                </p>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: themeColors.textMuted,
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{ borderBottom: `1px solid ${themeColors.border}` }}
                  >
                    <th style={{ textAlign: "left", padding: "12px" }}>#</th>
                    <th style={{ textAlign: "left", padding: "12px" }}>
                      Family Name
                    </th>
                    <th style={{ textAlign: "right", padding: "12px" }}>
                      Expected (£)
                    </th>
                    <th style={{ textAlign: "right", padding: "12px" }}>
                      Paid (£)
                    </th>
                    <th style={{ textAlign: "right", padding: "12px" }}>
                      Remaining (£)
                    </th>
                    <th style={{ textAlign: "center", padding: "12px" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {families.map((family, idx) => (
                    <tr
                      key={family.familyId}
                      style={{
                        borderBottom: `1px solid ${themeColors.border}`,
                      }}
                    >
                      <td style={{ padding: "12px" }}>{idx + 1}</td>
                      <td style={{ padding: "12px", fontWeight: 500 }}>
                        {family.name}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        £{family.expectedAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        £{family.paidAmount.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: statusColor[type],
                        }}
                      >
                        £
                        {(family.expectedAmount - family.paidAmount).toFixed(2)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            backgroundColor: getBgColor(statusColor[type], 0.2),
                            color: statusColor[type],
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          {type === "paid"
                            ? "Paid"
                            : type === "partial"
                              ? "Partial"
                              : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: `1px solid ${themeColors.border}`,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  backgroundColor: themeColors.primary,
                  border: "none",
                  padding: "8px 24px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "white",
                  fontWeight: 500,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetailsModal;
