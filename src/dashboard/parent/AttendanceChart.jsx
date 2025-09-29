import React from "react";
import Chart from "react-apexcharts";
import { useGetAttendanceByStudentSummaryQuery } from "../../redux/features/attendances/attendancesApi";

const AttendanceChart = ({ studentId }) => {
  const {
    data: attendanceSummary,
    isLoading,
    error,
  } = useGetAttendanceByStudentSummaryQuery(studentId, {
    skip: !studentId,
  });

  console.log(attendanceSummary);
  // Process the aggregated data
  const processAttendanceData = () => {
    if (!attendanceSummary) {
      return {
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
      };
    }

    return {
      present: attendanceSummary.present?.count || 0,
      absent: attendanceSummary.absent?.count || 0,
      late: attendanceSummary.late?.count || 0,
      total: attendanceSummary.total || 0,
    };
  };

  const attendanceCounts = processAttendanceData();

  const series = [
    attendanceCounts.present,
    attendanceCounts.absent,
    attendanceCounts.late,
  ];

  // ... rest of your component remains the same
  const options = {
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
              color: "#6b7280",
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "#1f2937",
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: 600,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    // ... rest of options
  };

  // Calculate attendance percentage
  const attendancePercentage =
    attendanceCounts.total > 0
      ? ((attendanceCounts.present / attendanceCounts.total) * 100).toFixed(1)
      : 0;

  if (isLoading) {
    return (
      <div className="attendance-chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-chart-error">
        <p>Error loading attendance data</p>
      </div>
    );
  }

  return (
    <div className="attendance-chart-container">
      <div className="attendance-chart-header">
        <h3>Attendance Overview</h3>
        {attendanceCounts.total > 0 && (
          <div className="attendance-stats">
            <div className="attendance-percentage">
              <span className="percentage-value">{attendancePercentage}%</span>
              <span className="percentage-label">Attendance Rate</span>
            </div>
            <div className="total-classes">
              <span className="total-value">{attendanceCounts.total}</span>
              <span className="total-label">Total Classes</span>
            </div>
          </div>
        )}
      </div>

      {attendanceCounts.total > 0 ? (
        <Chart
          options={options}
          series={series}
          type="donut"
          width="380"
          height="320"
        />
      ) : (
        <div className="no-attendance-data">
          <p>No attendance records found</p>
          <span>Attendance data will appear here once recorded</span>
        </div>
      )}

      {/* Detailed Statistics */}
      {attendanceCounts.total > 0 && (
        <div className="attendance-details">
          <div className="stat-item present">
            <span className="stat-dot"></span>
            <span className="stat-label">Present:</span>
            <span className="stat-value">{attendanceCounts.present}</span>
          </div>
          <div className="stat-item absent">
            <span className="stat-dot"></span>
            <span className="stat-label">Absent:</span>
            <span className="stat-value">{attendanceCounts.absent}</span>
          </div>
          <div className="stat-item late">
            <span className="stat-dot"></span>
            <span className="stat-label">Late:</span>
            <span className="stat-value">{attendanceCounts.late}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;
