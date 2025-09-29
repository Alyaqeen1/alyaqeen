import React from "react";
import Chart from "react-apexcharts";

const AttendanceChart = () => {
  const series = [18, 5, 2]; // present, absent, late
  const options = {
    chart: {
      type: "donut",
    },
    labels: ["Present", "Absent", "Late"],
    colors: ["#22c55e", "#ef4444", "#facc15"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return <Chart options={options} series={series} type="donut" width="380" />;
};

export default AttendanceChart;
