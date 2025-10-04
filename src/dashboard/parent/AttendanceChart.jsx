import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { useGetAttendanceByStudentSummaryQuery } from "../../redux/features/attendances/attendancesApi";

const AttendanceChart = ({ studentId }) => {
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

  const {
    data: attendanceSummary,
    isLoading,
    error,
  } = useGetAttendanceByStudentSummaryQuery(queryParams, {
    skip: !studentId,
    refetchOnMountOrArgChange: true,
  });

  // Process the data correctly
  const attendanceData = useMemo(() => {
    if (!attendanceSummary) {
      return {
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
        studentName: "",
        attendanceRate: 0,
      };
    }

    // Handle both response formats
    const present =
      typeof attendanceSummary.present === "number"
        ? attendanceSummary.present
        : attendanceSummary.present?.count || 0;

    const absent =
      typeof attendanceSummary.absent === "number"
        ? attendanceSummary.absent
        : attendanceSummary.absent?.count || 0;

    const late =
      typeof attendanceSummary.late === "number"
        ? attendanceSummary.late
        : attendanceSummary.late?.count || 0;

    const total = attendanceSummary.total || 0;
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;

    return {
      present,
      absent,
      late,
      total,
      studentName: attendanceSummary.studentName || "",
      attendanceRate: Math.round(attendanceRate * 10) / 10, // Round to 1 decimal
    };
  }, [attendanceSummary]);

  // Chart series and options
  const chartSeries = [
    attendanceData.present,
    attendanceData.absent,
    attendanceData.late,
  ];

  const chartOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    labels: ["Present", "Absent", "Late"],
    colors: ["#22c55e", "#ef4444", "#facc15"],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: "bold",
            },
            total: {
              show: true,
              label: "Total Classes",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return (
          opts.w.globals.labels[opts.seriesIndex] + ": " + val.toFixed(1) + "%"
        );
      },
      style: {
        fontSize: "11px",
        fontWeight: "bold",
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " classes";
        },
      },
    },
  };

  // Clear filters
  const clearFilters = () => {
    setMonth("");
    setYear("");
  };

  if (isLoading) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-body text-center py-5 d-flex flex-column justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0">Loading attendance data...</p>
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
            Error loading attendance data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm min-vh-100">
      <div className="card-body d-flex flex-column">
        {/* Header with filters */}
        <div className="mb-4">
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
              Showing data for:
              {month && ` ${getMonthName(month)}`}
              {year && ` ${year}`}
            </small>
          </div>
        )}

        {/* Content area that grows to fill available space */}
        <div className="flex-grow-1">
          {/* Stats Overview */}
          {attendanceData.total > 0 ? (
            <div className="h-100 d-flex flex-column">
              <div className="row text-center mb-4">
                <div className="col-6 col-md-4 mb-3">
                  <div className="border rounded p-2 bg-success bg-opacity-10 h-100">
                    <h4 className="text-success mb-1">
                      {attendanceData.attendanceRate}%
                    </h4>
                    <small className="text-muted">Attendance Rate</small>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="border rounded p-2 bg-primary bg-opacity-10 h-100">
                    <h4 className="text-primary mb-1">
                      {attendanceData.total}
                    </h4>
                    <small className="text-muted">Total Classes</small>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="border rounded p-2 bg-warning bg-opacity-10 h-100">
                    <h4 className="text-warning mb-1">{attendanceData.late}</h4>
                    <small className="text-muted">Late Arrivals</small>
                  </div>
                </div>
              </div>

              {/* Chart - takes available space */}
              <div className="mb-4 flex-grow-1 d-flex align-items-center">
                <div className="w-100">
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                    height={300}
                  />
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="mt-auto">
                <div className="row">
                  <div className="col-md-8 mx-auto">
                    <div className="list-group">
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-success">
                          <i className="bi bi-check-circle me-2"></i>
                          Present
                        </span>
                        <span className="badge bg-success rounded-pill">
                          {attendanceData.present}
                        </span>
                      </div>
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-danger">
                          <i className="bi bi-x-circle me-2"></i>
                          Absent
                        </span>
                        <span className="badge bg-danger rounded-pill">
                          {attendanceData.absent}
                        </span>
                      </div>
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-warning">
                          <i className="bi bi-clock me-2"></i>
                          Late
                        </span>
                        <span className="badge bg-warning rounded-pill">
                          {attendanceData.late}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-100 d-flex flex-column justify-content-center text-center py-5">
              <div className="text-muted display-1 mb-3">📊</div>
              <h5 className="text-muted">No Attendance Records</h5>
              <p className="text-muted mb-0">
                {month || year
                  ? "No attendance records found for the selected filters."
                  : "No attendance records found for this student."}
              </p>
            </div>
          )}
        </div>
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

export default AttendanceChart;
