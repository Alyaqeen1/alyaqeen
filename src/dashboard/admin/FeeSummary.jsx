import React, { useState } from "react";
import FamilyDetailsModal from "./FamilyDetailsModal";

const FeeSummary = ({
  themeColors,
  getBgColor,
  feeSummaryData,
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
}) => {
  const [activeModal, setActiveModal] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const yearOptions = [2023, 2024, 2025, 2026];

  if (!feeSummaryData) return null;

  const { summary, families } = feeSummaryData;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        border: `1px solid ${themeColors.border}`,
      }}
    >
      {/* Header with Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 style={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
          Fee Collection Summary - {feeSummaryData.monthName}{" "}
          {feeSummaryData.year}
        </h4>
        <div className="d-flex gap-3">
          <select
            className="form-select"
            style={{ width: "100px" }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ width: "130px" }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            style={{
              backgroundColor: getBgColor("primary", 0.05),
              borderRadius: "8px",
              padding: "16px",
              borderLeft: `4px solid ${themeColors.primary}`,
            }}
          >
            <small style={{ color: themeColors.textMuted }}>
              Total Expected
            </small>
            <h3 style={{ margin: "4px 0", color: themeColors.primary }}>
              £{summary.totalExpected.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div
            style={{
              backgroundColor: getBgColor("success", 0.05),
              borderRadius: "8px",
              padding: "16px",
              borderLeft: `4px solid ${themeColors.success}`,
            }}
          >
            <small style={{ color: themeColors.textMuted }}>
              Total Received
            </small>
            <h3 style={{ margin: "4px 0", color: themeColors.success }}>
              £{summary.totalReceived.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div
            style={{
              backgroundColor: getBgColor("danger", 0.05),
              borderRadius: "8px",
              padding: "16px",
              borderLeft: `4px solid ${themeColors.danger}`,
            }}
          >
            <small style={{ color: themeColors.textMuted }}>
              Total Outstanding
            </small>
            <h3 style={{ margin: "4px 0", color: themeColors.danger }}>
              £{summary.totalOutstanding.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* Collection Rate Progress */}
      <div className="mb-4">
        <div className="d-flex justify-content-between mb-1">
          <small>Collection Rate</small>
          <small className="fw-bold">{summary.collectionRate}%</small>
        </div>
        <div
          style={{
            backgroundColor: themeColors.border,
            borderRadius: "10px",
            height: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${summary.collectionRate}%`,
              backgroundColor:
                summary.collectionRate >= 70
                  ? themeColors.success
                  : themeColors.warning,
              height: "100%",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>
      </div>

      {/* Family Breakdown Cards */}
      <div className="row g-3">
        <div className="col-md-4">
          <div
            onClick={() => families.paid?.length > 0 && setActiveModal("paid")}
            style={{
              backgroundColor: getBgColor("success", 0.1),
              borderRadius: "8px",
              padding: "16px",
              cursor: families.paid?.length > 0 ? "pointer" : "default",
              textAlign: "center",
              transition: "transform 0.2s",
              opacity: families.paid?.length === 0 ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (families.paid?.length > 0)
                e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <i
              className="bi bi-check-circle"
              style={{ fontSize: "24px", color: themeColors.success }}
            ></i>
            <h3 style={{ margin: "8px 0", color: themeColors.success }}>
              {summary.paidFamiliesCount}
            </h3>
            <small>Fully Paid</small>
          </div>
        </div>

        <div className="col-md-4">
          <div
            onClick={() =>
              families.partiallyPaid?.length > 0 && setActiveModal("partial")
            }
            style={{
              backgroundColor: getBgColor("warning", 0.1),
              borderRadius: "8px",
              padding: "16px",
              cursor:
                families.partiallyPaid?.length > 0 ? "pointer" : "default",
              textAlign: "center",
              transition: "transform 0.2s",
              opacity: families.partiallyPaid?.length === 0 ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (families.partiallyPaid?.length > 0)
                e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <i
              className="bi bi-exclamation-triangle"
              style={{ fontSize: "24px", color: themeColors.warning }}
            ></i>
            <h3 style={{ margin: "8px 0", color: themeColors.warning }}>
              {summary.partiallyPaidFamiliesCount}
            </h3>
            <small>Partially Paid</small>
          </div>
        </div>

        <div className="col-md-4">
          <div
            onClick={() =>
              families.unpaid?.length > 0 && setActiveModal("unpaid")
            }
            style={{
              backgroundColor: getBgColor("danger", 0.1),
              borderRadius: "8px",
              padding: "16px",
              cursor: families.unpaid?.length > 0 ? "pointer" : "default",
              textAlign: "center",
              transition: "transform 0.2s",
              opacity: families.unpaid?.length === 0 ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (families.unpaid?.length > 0)
                e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <i
              className="bi bi-x-circle"
              style={{ fontSize: "24px", color: themeColors.danger }}
            ></i>
            <h3 style={{ margin: "8px 0", color: themeColors.danger }}>
              {summary.unpaidFamiliesCount}
            </h3>
            <small>Unpaid</small>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FamilyDetailsModal
        show={activeModal === "paid"}
        handleClose={() => setActiveModal(null)}
        families={families.paid || []}
        title={`Fully Paid Families (${summary.paidFamiliesCount})`}
        type="paid"
        themeColors={themeColors}
        getBgColor={getBgColor}
      />

      <FamilyDetailsModal
        show={activeModal === "partial"}
        handleClose={() => setActiveModal(null)}
        families={families.partiallyPaid || []}
        title={`Partially Paid Families (${summary.partiallyPaidFamiliesCount})`}
        type="partial"
        themeColors={themeColors}
        getBgColor={getBgColor}
      />

      <FamilyDetailsModal
        show={activeModal === "unpaid"}
        handleClose={() => setActiveModal(null)}
        families={families.unpaid || []}
        title={`Unpaid Families (${summary.unpaidFamiliesCount})`}
        type="unpaid"
        themeColors={themeColors}
        getBgColor={getBgColor}
      />
    </div>
  );
};

export default FeeSummary;
