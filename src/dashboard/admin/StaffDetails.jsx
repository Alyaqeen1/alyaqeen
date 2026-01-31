import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const StaffDetails = ({
  teachersCount,
  staffPresence,
  screenSize,
  themeColors,
}) => {
  const [sourceDataChart, setSourceDataChart] = useState(null);

  useEffect(() => {
    setSourceDataChart({
      series: [
        teachersCount?.activity?.active,
        teachersCount?.gender?.male,
        teachersCount?.gender?.female,
        teachersCount?.activity?.inactive,
      ],
      options: {
        chart: {
          type: "pie",
          height: 250,
        },
        colors: [
          themeColors.primary,
          themeColors.success,
          themeColors.warning,
          themeColors.danger,
        ],
        labels: ["Active", "Male", "Female", "Inactive"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }, [teachersCount, themeColors]);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        border: `1px solid ${themeColors.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h4
          style={{
            fontSize: "16px",
            fontWeight: 600,
            margin: 0,
            color: themeColors.textPrimary,
          }}
        >
          Staff Details
        </h4>
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: themeColors.textMuted,
          }}
        >
          <i
            className="bi bi-three-dots-vertical"
            style={{ fontSize: "16px" }}
          ></i>
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "200px", height: "200px" }}>
          {sourceDataChart && (
            <ApexCharts
              options={sourceDataChart.options}
              series={sourceDataChart.series}
              type="pie"
              height={200}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "14px",
                color: themeColors.textMuted,
                margin: 0,
              }}
            >
              Total Active Staff
            </p>
            <p
              style={{
                fontSize: "25px",
                fontWeight: 700,
                margin: "4px 0 0 0",
                color: themeColors.textPrimary,
              }}
            >
              {teachersCount?.total}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "14px",
                color: themeColors.textMuted,
                margin: 0,
              }}
            >
              Today Present Staff
            </p>
            <p
              style={{
                fontSize: "25px",
                fontWeight: 700,
                margin: "4px 0 0 0",
                color: themeColors.textPrimary,
              }}
            >
              {staffPresence?.present_count}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            screenSize === "lg" ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
          borderTop: `1px dashed ${themeColors.border}`,
        }}
      >
        {[
          {
            label: "Male",
            value: teachersCount?.gender?.male,
            borderRight: true,
          },
          { label: "Female", value: teachersCount?.gender?.female },
          {
            label: "Inactive",
            value: teachersCount?.activity?.inactive,
            borderRight: screenSize === "lg",
            borderBottom: screenSize === "lg",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              padding: "2px",
              textAlign: "center",
              borderRight: item.borderRight
                ? `1px dashed ${themeColors.border}`
                : "none",
              borderBottom: item.borderBottom
                ? `1px dashed ${themeColors.border}`
                : "none",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: themeColors.textMuted,
                margin: "0 0 4px 0",
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                margin: 0,
                color: themeColors.textPrimary,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDetails;
