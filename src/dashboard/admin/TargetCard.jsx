import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import img from "../../assets/image.png";
import { useGetTodayBasicSummaryQuery } from "../../redux/features/attendances/attendancesApi";

const TargetCard = ({ themeColors }) => {
  const [targetChart, setTargetChart] = useState(null);
  const { data: todayBasicSummary, isLoading: isTodayBasicSummaryLoading } =
    useGetTodayBasicSummaryQuery();

  useEffect(() => {
    setTargetChart({
      series: [48, 52],
      options: {
        chart: {
          type: "donut",
          height: 150,
        },
        colors: [themeColors.warning, themeColors.border],
        plotOptions: {
          pie: {
            donut: {
              size: "75%",
            },
          },
        },
        labels: ["Completed", "Remaining"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          width: 0,
        },
      },
    });
  }, [themeColors]);

  return (
    <div
      style={{
        backgroundColor: "var(--border2)",
        backgroundImage: `url(${img})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        borderRadius: "8px",
        padding: "20px",
        color: "white",
        marginBottom: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "white",
              margin: "0 0 8px 0",
            }}
          >
            Assalamu Alaikum 🌙
          </h3>
          <p
            style={{
              fontSize: "12px",
              opacity: 0.8,
              margin: "0 0 8px 0",
            }}
          >
            May Allah put barakah in today’s work.
          </p>
          <p
            style={{
              fontSize: "12px",
              opacity: 0.8,
              margin: "0 0 8px 0",
            }}
          >
            {todayBasicSummary?.message || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TargetCard;
