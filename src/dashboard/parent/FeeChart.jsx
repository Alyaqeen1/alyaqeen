import React, { useState, useMemo } from "react";
import { useGetFeesByStudentIdQuery } from "../../redux/features/fees/feesApi";
import Chart from "react-apexcharts";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

const getMonthName = (month) => {
  const months = [
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
  return months[parseInt(month) - 1] || month;
};

export default function FeeChart({ studentId }) {
  const {
    data: feeData,
    isLoading,
    isError,
  } = useGetFeesByStudentIdQuery(studentId);
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("last6months");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Calculate overall completion rate including unpaid months
  const overallStats = useMemo(() => {
    if (!feeData)
      return {
        overallRate: 0,
        totalExpectedIncludingUnpaid: 0,
        paidMonthsTotal: 0,
      };

    const paidMonthsTotal = feeData.totalPaid || 0;

    // Calculate total expected including unpaid months
    let totalExpectedIncludingUnpaid = feeData.totalExpected || 0;

    // Add expected fees from unpaid months
    if (feeData.unpaidMonths) {
      const unpaidTotal = feeData.unpaidMonths.reduce((sum, month) => {
        return sum + (month.expectedFee || 0);
      }, 0);
      totalExpectedIncludingUnpaid += unpaidTotal;
    }

    const overallRate =
      totalExpectedIncludingUnpaid > 0
        ? Math.round((paidMonthsTotal / totalExpectedIncludingUnpaid) * 100)
        : 0;

    return {
      overallRate,
      totalExpectedIncludingUnpaid,
      paidMonthsTotal,
    };
  }, [feeData]);

  // Prepare chart data with unpaid months included
  const chartData = useMemo(() => {
    // If no fee data at all, return empty structure
    if (!feeData) {
      return {
        categories: [],
        paymentRate: [],
        statusColors: [],
        rawData: [],
      };
    }

    const paymentHistory = feeData.paymentHistory || [];
    const unpaidMonths = feeData.unpaidMonths || [];

    // If no data at all, return empty
    if (paymentHistory.length === 0 && unpaidMonths.length === 0) {
      return {
        categories: [],
        paymentRate: [],
        statusColors: [],
        rawData: [],
      };
    }

    // Combine paid and unpaid data
    const allMonths = [
      ...paymentHistory.map((item) => ({
        ...item,
        isPaid: true,
        paymentRate:
          item.expected > 0 ? Math.round((item.paid / item.expected) * 100) : 0,
        statusColor:
          item.status === "fully_paid"
            ? "#00E396"
            : item.status === "partial"
            ? "#FEB019"
            : "#FF4560",
      })),
      ...unpaidMonths.map((item) => ({
        ...item,
        isPaid: false,
        paid: 0,
        expected: item.expectedFee,
        paymentRate: 0,
        statusColor: "#FF4560",
        status: "unpaid",
      })),
    ];

    // Filter by time range
    const filteredData = allMonths.filter((item) => {
      if (timeRange === "all") return true;

      const itemDate = new Date(item.year, parseInt(item.month) - 1);
      const now = new Date();
      let cutoffDate = new Date();

      switch (timeRange) {
        case "1year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        case "last6months":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "last3months":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        default:
          return true;
      }

      return itemDate >= cutoffDate;
    });

    // Filter by specific month and year if selected
    let finalData = filteredData;
    if (selectedMonth && selectedYear) {
      finalData = filteredData.filter(
        (item) =>
          item.month === selectedMonth && item.year.toString() === selectedYear
      );
    }

    // Sort by date
    const sortedData = [...finalData].sort((a, b) => {
      const dateA = new Date(a.year, parseInt(a.month) - 1);
      const dateB = new Date(b.year, parseInt(b.month) - 1);
      return dateA - dateB;
    });

    return {
      categories: sortedData.map(
        (item) => `${getMonthName(item.month)} ${item.year}`
      ),
      paymentRate: sortedData.map((item) => item.paymentRate),
      statusColors: sortedData.map((item) => item.statusColor),
      rawData: sortedData,
    };
  }, [feeData, timeRange, selectedMonth, selectedYear]);

  // Helper function to get full month name

  // Get unique years and months for filters
  const availableYears = useMemo(() => {
    if (!feeData) return [];
    const paymentYears =
      feeData.paymentHistory?.map((item) => item.year.toString()) || [];
    const unpaidYears =
      feeData.unpaidMonths?.map((item) => item.year.toString()) || [];
    const years = [...new Set([...paymentYears, ...unpaidYears])];
    return years.sort((a, b) => b - a);
  }, [feeData]);

  const availableMonths = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Donut chart data with partial payments included
  const donutData = useMemo(() => {
    if (!feeData)
      return {
        series: [0, 0, 100],
        labels: ["Fully Paid", "Partially Paid", "Unpaid"],
      };

    const paidMonths =
      feeData.paymentHistory?.filter((item) => item.status === "fully_paid") ||
      [];
    const partialMonths =
      feeData.paymentHistory?.filter((item) => item.status === "partial") || [];
    const unpaidMonths = feeData.unpaidMonths || [];

    const totalMonths =
      paidMonths.length + partialMonths.length + unpaidMonths.length;

    if (totalMonths === 0)
      return {
        series: [0, 0, 100],
        labels: ["Fully Paid", "Partially Paid", "Unpaid"],
      };

    const paidPercentage = Math.round((paidMonths.length / totalMonths) * 100);
    const partialPercentage = Math.round(
      (partialMonths.length / totalMonths) * 100
    );
    const unpaidPercentage = 100 - paidPercentage - partialPercentage;

    return {
      series: [paidPercentage, partialPercentage, unpaidPercentage],
      labels: ["Fully Paid", "Partially Paid", "Unpaid"],
    };
  }, [feeData]);

  const donutOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    labels: donutData.labels,
    colors: ["#00E396", "#FEB019", "#FF4560"], // Green, Yellow, Red
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              formatter: function (val) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: "Distribution",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return Math.round(total) + "%";
              },
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  const donutSeries = donutData.series;

  // Monthly percentage chart with status colors
  const percentageChartOptions = {
    chart: {
      type: chartType,
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    dataLabels: {
      enabled: chartType === "bar",
      formatter: (val) => `${val}%`,
      style: {
        fontSize: "11px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: chartData?.categories || [],
      labels: {
        rotate: -45,
        style: {
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Payment Completion Rate (%)",
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
      },
      min: 0,
      max: 100,
      labels: {
        formatter: (val) => `${val}%`,
      },
    },
    colors:
      chartData?.statusColors && chartData.statusColors.length > 0
        ? chartData.statusColors
        : ["#008FFB"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    title: {
      text: `Monthly Payment`,
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = chartData?.rawData?.[dataPointIndex];
        if (!data) return "";

        const statusText =
          data.status === "fully_paid"
            ? "Fully Paid"
            : data.status === "partial"
            ? "Partially Paid"
            : "Unpaid";
        const amountText = data.isPaid
          ? `Paid: $${data.paid} / Expected: $${data.expected}`
          : `Expected: $${data.expected}`;

        return `
          <div class="p-2 bg-white rounded shadow">
            <div class="font-semibold">${w.globals.categoryLabels[dataPointIndex]}</div>
            <div class="text-sm mt-1">Status: <span style="color: ${data.statusColor}">${statusText}</span></div>
            <div class="text-sm">${amountText}</div>
            <div class="text-sm">Completion: ${series[seriesIndex][dataPointIndex]}%</div>
          </div>
        `;
      },
    },
  };

  const percentageChartSeries = [
    {
      name: "Payment Completion Rate",
      data: chartData?.paymentRate || [],
    },
  ];

  // Reset month filter when year changes
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("");
  };

  // Clear monthly filters
  const clearMonthlyFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  // Payment status summary
  const paymentSummary = useMemo(() => {
    if (!chartData?.rawData || chartData.rawData.length === 0) {
      return {
        totalMonths: 0,
        paidMonths: 0,
        unpaidMonths: 0,
        partialPayments: 0,
        currentUnpaid: 0,
      };
    }

    const paidMonths = chartData.rawData.filter((item) => item.isPaid);
    const unpaidMonths = chartData.rawData.filter((item) => !item.isPaid);
    const partialPayments = paidMonths.filter(
      (item) => item.status === "partial"
    ).length;

    return {
      totalMonths: chartData.rawData.length,
      paidMonths: paidMonths.length,
      unpaidMonths: unpaidMonths.length,
      partialPayments,
      currentUnpaid: unpaidMonths.filter((item) => item.isCurrentMonth).length,
    };
  }, [chartData]);

  if (isLoading) return <LoadingSpinnerDash></LoadingSpinnerDash>;

  if (isError)
    return (
      <div className="d-flex justify-content-center align-items-center h-64">
        <div className="text-danger text-lg">Error loading fee data</div>
      </div>
    );

  // Handle case where student has no fee records
  if (
    !feeData ||
    (feeData.paymentHistory?.length === 0 && feeData.unpaidMonths?.length === 0)
  )
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <h1 className="h3 card-title mb-1">Fee Payment Analytics</h1>
              <p className="text-muted mb-0">
                {feeData?.studentName || "Student"}
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <span className="badge bg-secondary">NO FEE RECORDS</span>
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center bg-light rounded h-64">
            <div className="text-center">
              <div className="text-muted display-1 mb-3">💰</div>
              <h3 className="h5 text-dark mb-2">No Fee Records Found</h3>
              <p className="text-muted">
                This student doesn't have any fee payment records yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* Top Section: Donut & Filters */}
        <div className="row mb-4">
          {/* Donut Chart */}
          <div className="col-xl-4 mb-4 mb-md-0">
            <div className="card">
              <div className="card-body">
                <div className="text-center mt-2 text-muted small">
                  Payment Distribution
                </div>
                <Chart
                  options={donutOptions}
                  series={donutSeries}
                  type="donut"
                  height={285} // ⬅ increased height
                />
              </div>
            </div>
          </div>

          {/* Filters Container */}
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                <div className="row g-3">
                  {/* Chart Type Filter */}
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Chart Type</label>
                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      className="form-select"
                    >
                      <option value="line">Line Chart</option>
                      <option value="bar">Bar Chart</option>
                      <option value="area">Area Chart</option>
                    </select>
                  </div>

                  {/* Time Range Filter */}
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Time Range</label>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="form-select"
                    >
                      <option value="all">All Time</option>
                      <option value="1year">Last 1 Year</option>
                      <option value="last6months">Last 6 Months</option>
                      <option value="last3months">Last 3 Months</option>
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Year</label>
                    <select
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="form-select"
                    >
                      <option value="">All Years</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month Filter */}
                  <div className="col-md-6 col-lg-3">
                    <label className="form-label">Month</label>
                    <div className="input-group">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        disabled={!selectedYear}
                        className="form-select"
                      >
                        <option value="">All Months</option>
                        {availableMonths.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                      {(selectedMonth || selectedYear) && (
                        <button
                          onClick={clearMonthlyFilters}
                          className="btn btn-outline-secondary"
                          type="button"
                          title="Clear filters"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Filters Info */}
                {(selectedMonth || selectedYear) && (
                  <div className="mt-3 text-muted small">
                    Showing: {selectedYear || "All Years"}{" "}
                    {selectedMonth
                      ? `- ${
                          availableMonths.find((m) => m.value === selectedMonth)
                            ?.label
                        }`
                      : ""}
                    {chartData?.rawData?.length === 0 && (
                      <span className="text-warning ms-2">
                        (No data for selected filters)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {paymentSummary && paymentSummary.totalMonths > 0 && (
              <div className="row mt-4">
                <div className=" col-6 mb-3">
                  <div className="card border-success h-100">
                    <div className="card-body text-center">
                      <h3 className="card-title text-success">
                        {paymentSummary.paidMonths}
                      </h3>
                      <p className="card-text text-muted small">
                        Fully Paid Months
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="card border-warning h-100">
                    <div className="card-body text-center">
                      <h3 className="card-title text-warning">
                        {paymentSummary.partialPayments}
                      </h3>
                      <p className="card-text text-muted small">
                        Partially Paid Months
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-6 mb-3">
                  <div className="card border-danger h-100">
                    <div className="card-body text-center">
                      <h3 className="card-title text-danger">
                        {paymentSummary.unpaidMonths}
                      </h3>
                      <p className="card-text text-muted small">
                        Unpaid Months
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="card border-primary h-100">
                    <div className="card-body text-center">
                      <h3 className="card-title text-primary">
                        {paymentSummary.currentUnpaid}
                      </h3>
                      <p className="card-text text-muted small">Current Due</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary Cards */}

        {/* Bottom Section: Monthly Chart */}
        {chartData?.rawData && chartData.rawData.length > 0 ? (
          <div className="card">
            <div className="card-body">
              <Chart
                options={percentageChartOptions}
                series={percentageChartSeries}
                type={chartType}
                height={350}
              />
            </div>
          </div>
        ) : (
          <div className="card bg-light">
            <div className="card-body text-center py-5">
              <div className="text-muted display-4 mb-3">📊</div>
              <h3 className="h5 text-dark mb-2">No Data Available</h3>
              <p className="text-muted">
                No payment data found for the selected filters.
              </p>
            </div>
          </div>
        )}

        {/* Legend - ALWAYS SHOW ALL THREE COLORS */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
          <div className="d-flex align-items-center">
            {/* <div
              className="bg-success rounded-circle me-2"
              style={{ width: "12px", height: "12px" }}
            ></div> */}
            <span className="text-muted small">Fully Paid (100%)</span>
          </div>
          <div className="d-flex align-items-center">
            {/* <div
              className="bg-warning rounded-circle me-2"
              style={{ width: "12px", height: "12px" }}
            ></div> */}
            <span className="text-muted small">Partially Paid (1-99%)</span>
          </div>
          <div className="d-flex align-items-center">
            {/* <div
              className="bg-danger rounded-circle me-2"
              style={{ width: "12px", height: "12px" }}
            ></div> */}
            <span className="text-muted small">Unpaid (0%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
