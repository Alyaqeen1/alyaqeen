import React, { useState } from "react";
import Chart from "react-apexcharts";
import { useGetMeritsOfStudentQuery } from "../../redux/features/merits/meritsApi";

const MeritChart = ({ studentId }) => {
  const [timeframe, setTimeframe] = useState("monthly"); // "monthly" or "weekly"

  const {
    data: meritData,
    isLoading,
    error,
  } = useGetMeritsOfStudentQuery(studentId, {
    skip: !studentId,
  });

  if (isLoading) {
    return (
      <div className="merit-chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading merit data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="merit-chart-error">
        <p>Error loading merit data</p>
      </div>
    );
  }

  if (!meritData || meritData.totalRecords === 0) {
    return (
      <div className="no-merit-data">
        <div className="no-data-icon">⭐</div>
        <h4>No Merit Records</h4>
        <p>Merit data will appear here once the student earns merit points</p>
      </div>
    );
  }

  // Prepare data for behavior breakdown chart with POINTS
  const behaviorSeries = Object.values(meritData.behaviorBreakdown)?.map(
    (behavior) => behavior.totalPoints
  );
  const behaviorLabels = Object.keys(meritData.behaviorBreakdown);

  // FIXED: Prepare trend data based on selected timeframe
  const trendData =
    timeframe === "weekly" ? meritData.weeklyTrend : meritData.monthlyTrend;
  const trendSeries = [
    {
      name: "Merit Points",
      data: trendData?.map((item) => item.points),
    },
  ];
  const trendCategories = trendData?.map((item) =>
    timeframe === "weekly" ? item.week : item.month
  );

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
      enabled: false, // Disabled for compact view
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
      enabled: false, // Disabled for compact view
    },
  };

  return (
    <div className="merit-chart-container">
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
              <small className="text-muted">Last 30 Days</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 bg-light h-100">
            <div className="card-body p-2 text-center">
              <div className="text-warning mb-1">📊</div>
              <h5 className="mb-0 fw-bold">
                {meritData.averagePoints.toFixed(1)}
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
                <small className="text-primary fw-bold">Most Frequent</small>
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
                <small className="text-success fw-bold">Highest Value</small>
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
                <small className="text-warning fw-bold">Behavior Types</small>
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
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <h6 className="card-title fw-bold mb-2">Points by Behavior</h6>
              <Chart
                options={behaviorOptions}
                series={behaviorSeries}
                type="donut"
                height={200}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title fw-bold mb-0">Points Trend</h6>
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
          {meritData.meritRecords.slice(0, 6)?.map((record, index) => (
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
  );
};

export default MeritChart;
