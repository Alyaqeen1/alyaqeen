import React, { useState, useEffect } from "react";
import FamilyDetailsModal from "./FamilyDetailsModal";
import ApexCharts from "react-apexcharts";

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
  const [feeChart, setFeeChart] = useState(null);

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

  // ===== Build chart when data is available =====
  useEffect(() => {
    if (!feeSummaryData?.summary) return;

    const { summary } = feeSummaryData;

    const paid = summary.paidFamiliesCount || 0;
    const partial = summary.partiallyPaidFamiliesCount || 0;
    const unpaid = summary.unpaidFamiliesCount || 0;
    const totalFamilies = paid + partial + unpaid;

    // Helper to compute percentages
    const getPercent = (count) =>
      totalFamilies > 0 ? Math.round((count / totalFamilies) * 100) : 0;

    setFeeChart({
      series: [getPercent(paid), getPercent(partial), getPercent(unpaid)],
      options: {
        chart: {
          type: "radialBar",
          offsetY: 0,
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: "30%",
              background: "transparent",
            },
            track: {
              background: themeColors.border,
              opacity: 0.3,
              strokeWidth: "97%",
              margin: 5,
            },
            dataLabels: {
              show: false,
            },
          },
        },
        colors: [themeColors.success, themeColors.warning, themeColors.danger],
        labels: ["Fully Paid", "Partially Paid", "Unpaid"],
        legend: {
          show: false,
        },
      },
    });
  }, [feeSummaryData, themeColors]);

  if (!feeSummaryData) return null;

  const { summary, families } = feeSummaryData;

  const paid = summary.paidFamiliesCount || 0;
  const partial = summary.partiallyPaidFamiliesCount || 0;
  const unpaid = summary.unpaidFamiliesCount || 0;
  const totalFamilies = paid + partial + unpaid;

  const getPercent = (count) =>
    totalFamilies > 0 ? Math.round((count / totalFamilies) * 100) : 0;

  // ===== Stats breakdown =====
  const stats = [
    {
      label: "Fully Paid",
      value: paid,
      percent: getPercent(paid),
      color: themeColors.success,
    },
    {
      label: "Partially Paid",
      value: partial,
      percent: getPercent(partial),
      color: themeColors.warning,
    },
    {
      label: "Unpaid",
      value: unpaid,
      percent: getPercent(unpaid),
      color: themeColors.danger,
    },
  ];

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

      {/* ===== Two Boxes: Nested Radial Chart + Breakdown ===== */}
      <div className="row g-3 mb-4">
        {/* Left: Nested Radial Bars */}
        <div className="col-md-6">
          <div
            style={{
              backgroundColor: getBgColor("primary", 0.03),
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${themeColors.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            <h6
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: themeColors.textPrimary,
                marginBottom: "8px",
              }}
            >
              Payment Distribution
            </h6>

            <div style={{ width: "100%", height: "280px" }}>
              {feeChart && (
                <ApexCharts
                  options={feeChart.options}
                  series={feeChart.series}
                  type="radialBar"
                  height={280}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Breakdown cards */}
        <div className="col-md-6">
          <div
            style={{
              backgroundColor: getBgColor("primary", 0.03),
              borderRadius: "8px",
              padding: "16px",
              border: `1px solid ${themeColors.border}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h6
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: themeColors.textPrimary,
                marginBottom: "12px",
              }}
            >
              Breakdown by Category
            </h6>

            {stats.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom:
                    index < stats.length - 1
                      ? `1px dashed ${themeColors.border}`
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  ></div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: themeColors.textPrimary,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: themeColors.textMuted,
                        margin: 0,
                      }}
                    >
                      {item.value} {item.value === 1 ? "family" : "families"}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: item.color,
                  }}
                >
                  {item.percent}%
                </div>
              </div>
            ))}

            {/* Total Families Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "12px",
                marginTop: "8px",
                borderTop: `1px solid ${themeColors.border}`,
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: themeColors.textMuted,
                  fontWeight: 600,
                }}
              >
                Total Families
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: themeColors.textPrimary,
                }}
              >
                {totalFamilies}
              </span>
            </div>
          </div>
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
