import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { useGetMeritsOfStudentQuery } from "../../redux/features/merits/meritsApi";

const MeritChart = ({ studentId }) => {
  const [timeframe, setTimeframe] = useState("monthly"); // "monthly" or "weekly"
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Generate years: 2 previous, current, 2 future
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];

    // Add previous 2 years
    for (let i = 2; i > 0; i--) {
      years.push(currentYear - i);
    }

    // Add current year
    years.push(currentYear);

    // Add next 2 years
    for (let i = 1; i <= 2; i++) {
      years.push(currentYear + i);
    }

    return years;
  }, []);

  // Create query params object
  const queryParams = useMemo(
    () => ({
      studentId,
      ...(month && { month }),
      ...(year && { year }),
    }),
    [studentId, month, year]
  );

  // In your MeritChart component - make sure you're using it like this:
  const {
    data: meritData,
    isLoading,
    error,
  } = useGetMeritsOfStudentQuery(
    { studentId, month, year }, // Pass as object
    {
      skip: !studentId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Clear filters
  const clearFilters = () => {
    setMonth("");
    setYear("");
  };

  // Check if no data is available
  const hasNoData = !meritData || meritData.totalRecords === 0;

  if (isLoading) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-body text-center py-5 d-flex flex-column justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0">Loading merit data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex flex-column justify-content-center">
          <div className="alert alert-danger text-center" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error loading merit data
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for behavior breakdown chart with POINTS
  const behaviorSeries = hasNoData
    ? []
    : Object.values(meritData.behaviorBreakdown)?.map(
        (behavior) => behavior.totalPoints
      );
  const behaviorLabels = hasNoData
    ? []
    : Object.keys(meritData.behaviorBreakdown);

  // Prepare trend data based on selected timeframe and filters
  let trendData, trendCategories;

  if (hasNoData) {
    trendData = [];
    trendCategories = [];
  } else if (meritData.trendType === "daily") {
    // Use daily trend data when specific month is selected
    trendData = meritData.trendData || [];
    trendCategories = trendData?.map((item) => item.period);
  } else {
    // Use weekly/monthly based on timeframe selection
    trendData =
      timeframe === "weekly"
        ? meritData.weeklyTrend
        : meritData.trendData || meritData.monthlyTrend;
    trendCategories = trendData?.map((item) =>
      timeframe === "weekly" ? item.week : item.period || item.month
    );
  }

  const trendSeries = [
    {
      name: "Merit Points",
      data: trendData?.map((item) => item.points || 0) || [],
    },
  ];

  // Behavior breakdown chart options - Compact version
  const behaviorOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      height: 200,
    },
    labels: behaviorLabels,
    colors: [
      "#22c55e",
      "#f59e0b",
      "#3b82f6",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#10b981",
    ],
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              color: "#6b7280",
              fontSize: "12px",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
            value: {
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "10px",
      itemMargin: {
        horizontal: 5,
        vertical: 2,
      },
      formatter: function (seriesName, opts) {
        const points = opts.w.config.series[opts.seriesIndex];
        return `${seriesName} (${points})`;
      },
    },
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex, w }) {
          const label = w.config.labels[seriesIndex];
          const behaviorData = meritData.behaviorBreakdown[label];
          const count = behaviorData?.count || 0;
          return `${value} pts (${count}x)`;
        },
      },
    },
  };

  // Trend chart options - Compact version
  const trendOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
      height: 200,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#3b82f6"],
    markers: {
      size: 3,
    },
    xaxis: {
      categories: trendCategories,
      labels: {
        style: {
          fontSize: "10px",
        },
        rotate: !hasNoData && meritData.trendType === "daily" ? -45 : 0,
      },
    },
    yaxis: {
      title: {
        text: "Points",
        style: {
          fontSize: "10px",
        },
      },
      min: 0,
      labels: {
        style: {
          fontSize: "10px",
        },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      padding: {
        bottom: -10,
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: hasNoData
        ? "No Data"
        : meritData.trendType === "daily"
        ? "Daily Trend"
        : timeframe === "weekly"
        ? "Weekly Trend"
        : "Monthly Trend",
      align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        {/* Header with filters */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <select
              className="form-select form-select-sm"
              style={{ minWidth: "120px" }}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <select
              className="form-select form-select-sm"
              style={{ minWidth: "100px" }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">All Years</option>
              {yearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>

            {(month || year) && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
                title="Clear filters"
                style={{ whiteSpace: "nowrap" }}
              >
                <i className="bi bi-x-lg me-1"></i>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filters info */}
        {(month || year) && (
          <div className="alert alert-info py-2 mb-3">
            <small>
              <i className="bi bi-funnel me-1"></i>
              {hasNoData
                ? `No data found for ${month ? getMonthName(month) : ""} ${
                    year || ""
                  }`.trim()
                : meritData.periodInfo ||
                  `Showing data for ${month ? getMonthName(month) : ""} ${
                    year || ""
                  }`.trim()}
            </small>
          </div>
        )}

        {/* Show no data message when there's no data */}
        {hasNoData ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center text-center py-5">
            <div className="text-muted display-1 mb-3">⭐</div>
            <h5 className="text-muted">No Merit Records</h5>
            <p className="text-muted mb-0">
              {month || year
                ? "No merit records found for the selected filters."
                : "Merit data will appear here once the student earns merit points"}
            </p>
            {(month || year) && (
              <button
                className="btn btn-primary mt-3"
                onClick={clearFilters}
                style={{ maxWidth: "200px", margin: "0 auto" }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Content area when data is available */
          <div className="flex-grow-1">
            {/* Merit Statistics - Compact Row */}
            <div className="row g-2 mb-3">
              <div className="col-6 col-md-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body p-2 text-center">
                    <div className="text-primary mb-1">⭐</div>
                    <h5 className="mb-0 fw-bold">{meritData.totalMerit}</h5>
                    <small className="text-muted">Total Points</small>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body p-2 text-center">
                    <div className="text-success mb-1">📈</div>
                    <h5 className="mb-0 fw-bold">{meritData.recentMerit}</h5>
                    <small className="text-muted">
                      {month || year ? "Filtered" : "Last 30 Days"}
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body p-2 text-center">
                    <div className="text-warning mb-1">📊</div>
                    <h5 className="mb-0 fw-bold">
                      {meritData.averagePoints?.toFixed(1) || "0.0"}
                    </h5>
                    <small className="text-muted">Avg per Award</small>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card border-0 bg-light h-100">
                  <div className="card-body p-2 text-center">
                    <div className="text-info mb-1">📝</div>
                    <h5 className="mb-0 fw-bold">{meritData.totalRecords}</h5>
                    <small className="text-muted">Total Awards</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavior Insights - Compact */}
            {meritData.behaviorStats && (
              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <div className="card border-0 bg-primary bg-opacity-10 h-100">
                    <div className="card-body p-2 text-center">
                      <small className="text-primary fw-bold">
                        Most Frequent
                      </small>
                      <div
                        className="text-dark fw-bold text-truncate"
                        title={meritData.behaviorStats.mostFrequent}
                      >
                        {meritData.behaviorStats.mostFrequent}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 bg-success bg-opacity-10 h-100">
                    <div className="card-body p-2 text-center">
                      <small className="text-success fw-bold">
                        Highest Value
                      </small>
                      <div
                        className="text-dark fw-bold text-truncate"
                        title={meritData.behaviorStats.highestValue}
                      >
                        {meritData.behaviorStats.highestValue}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 bg-warning bg-opacity-10 h-100">
                    <div className="card-body p-2 text-center">
                      <small className="text-warning fw-bold">
                        Behavior Types
                      </small>
                      <div className="text-dark fw-bold">
                        {meritData.behaviorStats.totalBehaviors}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Grid - Side by Side */}
            <div className="row g-3 mb-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-3">
                    <h6 className="card-title fw-bold mb-2">
                      Points by Behavior
                    </h6>
                    <Chart
                      options={behaviorOptions}
                      series={behaviorSeries}
                      type="donut"
                      height={200}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-title fw-bold mb-0">Points Trend</h6>
                      {!meritData.trendType ||
                      meritData.trendType === "monthly" ? (
                        <div className="btn-group btn-group-sm">
                          <button
                            className={`btn ${
                              timeframe === "weekly"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setTimeframe("weekly")}
                          >
                            Weekly
                          </button>
                          <button
                            className={`btn ${
                              timeframe === "monthly"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setTimeframe("monthly")}
                          >
                            Monthly
                          </button>
                        </div>
                      ) : (
                        <small className="text-muted">Daily View</small>
                      )}
                    </div>
                    <Chart
                      options={trendOptions}
                      series={trendSeries}
                      type="line"
                      height={200}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Merit Records - Compact Cards */}
            <div className="recent-merit-records">
              <h6 className="fw-bold border-start border-3 border-primary ps-2 mb-3">
                Recent Merit Awards
              </h6>
              <div className="row g-2">
                {meritData.meritRecords?.slice(0, 6).map((record, index) => (
                  <div key={index} className="col-sm-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="badge bg-success fs-7 px-2">
                            +{record.merit_points}
                          </span>
                          <small className="text-muted">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </small>
                        </div>
                        <h6
                          className="card-title fw-bold text-dark mb-1 fs-7 text-truncate"
                          title={record.behavior}
                        >
                          {record.behavior}
                        </h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {record.merit_points} pt
                            {record.merit_points !== 1 ? "s" : ""}
                          </small>
                          <small
                            className={`badge text-uppercase fs-8 merit-category-${record.merit_points}`}
                          >
                            {record.merit_points === 1 && "Basic"}
                            {record.merit_points === 2 && "Good"}
                            {record.merit_points === 3 && "Leader"}
                            {record.merit_points === 4 && "Top"}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get month name
function getMonthName(month) {
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
}

export default MeritChart;
