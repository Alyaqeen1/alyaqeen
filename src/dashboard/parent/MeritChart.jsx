import React from "react";
import Chart from "react-apexcharts";

const MeritChart = () => {
  const series = [
    {
      name: "Math",
      data: [65, 70, 75, 80],
    },
    {
      name: "Science",
      data: [60, 68, 74, 78],
    },
  ];

  const options = {
    chart: { type: "line", zoom: { enabled: false } },
    stroke: { curve: "smooth" },
    xaxis: { categories: ["Exam 1", "Exam 2", "Exam 3", "Exam 4"] },
  };

  return <Chart options={options} series={series} type="line" height={350} />;
};

export default MeritChart;
