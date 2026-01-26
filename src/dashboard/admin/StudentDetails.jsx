import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const StudentDetails = ({
  studentsCount,
  studentPresence,
  screenSize,
  themeColors,
}) => {
  const [jobsSummaryChart, setJobsSummaryChart] = useState(null);

  useEffect(() => {
    setJobsSummaryChart({
      series: [
        studentsCount?.session?.weekdays,
        studentsCount?.session?.weekend,
        studentsCount?.activity?.active,
        studentsCount?.activity?.inactive,
        studentsCount?.gender?.male,
        studentsCount?.gender?.female,
      ],
      options: {
        labels: ["Weekdays", "Weekend", "Active", "Inactive", "Male", "Female"],
        chart: {
          type: "donut",
          height: 240,
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          colors: ["#fff"],
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "70%",
              background: "transparent",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: themeColors.textPrimary,
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 8,
                  formatter: function (val) {
                    return val + "%";
                  },
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "Total",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: themeColors.textPrimary,
                  formatter: function () {
                    return studentsCount?.total || "0";
                  },
                },
              },
            },
          },
        },
        colors: [
          themeColors.primary,
          themeColors.success,
          themeColors.warning,
          themeColors.danger,
          themeColors.border2,
          themeColors.secondary,
        ],
      },
    });
  }, [studentsCount, themeColors]);

  const stats = [
    {
      label: "Weekdays",
      value: studentsCount?.session?.weekdays,
      color: themeColors.primary,
    },
    {
      label: "Weekends",
      value: studentsCount?.session?.weekend,
      color: themeColors.success,
    },
    {
      label: "Active",
      value: studentsCount?.activity?.active,
      color: themeColors.warning,
    },
    {
      label: "Inactive",
      value: studentsCount?.activity?.inactive,
      color: themeColors.danger,
    },
    {
      label: "Male",
      value: studentsCount?.gender?.male,
      color: themeColors.border2,
    },
    {
      label: "Female",
      value: studentsCount?.gender?.female,
      color: themeColors.secondary,
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          Student Details
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
        <div style={{ width: "100%", height: "240px" }}>
          {jobsSummaryChart && (
            <ApexCharts
              options={jobsSummaryChart.options}
              series={jobsSummaryChart.series}
              type="donut"
              height={240}
            />
          )}
        </div>

        <p className="mt-auto">
          Today Present Students:{" "}
          <strong>{studentPresence?.present_count}</strong>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "8px",
          borderTop: `1px dashed ${themeColors.border}`,
          paddingTop: "16px",
        }}
      >
        {stats.map((item, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  marginBottom: "4px",
                }}
              ></div>
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
                  fontSize: "14px",
                  fontWeight: 600,
                  margin: 0,
                  color: themeColors.textPrimary,
                }}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDetails;
