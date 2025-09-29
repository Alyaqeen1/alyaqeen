import React from "react";
import Chart from "react-apexcharts";
import MeritChart from "./MeritChart";
import AttendanceChart from "./AttendanceChart";

const StudentSummaryChart = () => {
  // Format data for chart
  const paidMonths = [
    { month: "2025-09", amount: 50 },
    { month: "2025-10", amount: 50 },
    { month: "2025-11", amount: 50 },
  ];

  const unpaidMonths = [
    { month: "2025-12", remainingAmount: 50 },
    { month: "2026-01", remainingAmount: 50 },
  ];

  const categories = [
    ...paidMonths.map((m) => m.month),
    ...unpaidMonths.map((m) => m.month),
  ];

  const series = [
    {
      name: "Paid",
      data: paidMonths.map((m) => m.amount),
    },
    {
      name: "Unpaid",
      data: unpaidMonths.map((m) => m.remainingAmount),
    },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: true },
    },
    xaxis: {
      categories,
      title: { text: "Months" },
    },
    yaxis: {
      title: { text: "Amount ($)" },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `$${val}`,
      },
    },
    legend: {
      position: "top",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    colors: ["#00E396", "#FF4560"], // green for paid, red for unpaid
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-3">Student Fee Summary</h2>
      <div className="row">
        <div className="col-lg-6">
          <AttendanceChart></AttendanceChart>
        </div>
        <div className="col-lg-6">
          <MeritChart></MeritChart>
        </div>
        {/* <Chart options={options} series={series} type="bar" height={350} /> */}
      </div>
    </div>
  );
};

export default StudentSummaryChart;
