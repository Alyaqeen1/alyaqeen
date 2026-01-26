import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const RevenueAnalytics = ({ themeColors }) => {
  const [revenueAnalyticsChart, setRevenueAnalyticsChart] = useState(null);

  useEffect(() => {
    setRevenueAnalyticsChart({
      series: [
        {
          name: "Revenue",
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 85, 95, 110],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 250,
          toolbar: {
            show: false,
          },
        },
        colors: [themeColors.secondary],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "45%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          labels: {
            style: {
              colors: themeColors.textMuted,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: themeColors.textMuted,
            },
          },
        },
        grid: {
          borderColor: themeColors.border,
        },
      },
    });
  }, [themeColors]);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        border: `1px solid ${themeColors.border}`,
        marginTop: "24px",
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
          Revenue Analytics
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "12px", color: themeColors.textMuted }}>
            View All
          </span>
          <i
            className="bi bi-chevron-down"
            style={{ fontSize: "12px", color: themeColors.textMuted }}
          ></i>
        </div>
      </div>
      <div style={{ height: "250px" }}>
        {revenueAnalyticsChart && (
          <ApexCharts
            options={revenueAnalyticsChart.options}
            series={revenueAnalyticsChart.series}
            type="bar"
            height={250}
          />
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
