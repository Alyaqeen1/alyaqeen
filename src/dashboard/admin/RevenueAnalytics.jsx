import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import { useGetRevenueSummaryQuery } from "../../redux/features/fees/feesApi";

const RevenueAnalytics = ({ themeColors }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Fetch data for selected year
  const {
    data: revenueSummary,
    isLoading,
    isFetching,
  } = useGetRevenueSummaryQuery(selectedYear);

  const [chartOptions, setChartOptions] = useState(null);
  const [chartSeries, setChartSeries] = useState(null);

  useEffect(() => {
    if (revenueSummary?.success) {
      // Set chart options
      const options = {
        chart: {
          type: "bar",
          height: 250,
          toolbar: { show: false },
        },
        colors: [themeColors.secondary],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "45%",
            dataLabels: { position: "top" },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val > 0 ? "£" + val.toLocaleString() : "";
          },
          offsetY: -20,
          style: {
            fontSize: "10px",
            colors: [themeColors.textMuted],
          },
        },
        xaxis: {
          categories: revenueSummary.categories,
          labels: {
            style: { colors: themeColors.textMuted },
          },
        },
        yaxis: {
          labels: {
            style: { colors: themeColors.textMuted },
            formatter: function (value) {
              return "£" + value.toLocaleString();
            },
          },
        },
        grid: { borderColor: themeColors.border },
        tooltip: {
          y: {
            formatter: function (value) {
              return (
                "£" +
                value.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              );
            },
          },
        },
        annotations: {
          yaxis: [
            {
              y: revenueSummary.summary?.average || 0,
              borderColor: themeColors.primary,
              label: {
                borderColor: themeColors.primary,
                style: {
                  color: "#fff",
                  background: themeColors.primary,
                },
                text: `Avg: £${(
                  revenueSummary.summary?.average || 0
                ).toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
              },
            },
          ],
        },
      };

      setChartOptions(options);
      setChartSeries(revenueSummary.series);
    } else {
      // Set empty/default chart if no data
      const options = {
        chart: {
          type: "bar",
          height: 250,
          toolbar: { show: false },
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
            style: { colors: themeColors.textMuted },
          },
        },
        yaxis: {
          labels: {
            style: { colors: themeColors.textMuted },
          },
        },
        grid: { borderColor: themeColors.border },
      };

      const series = [
        {
          name: "Revenue",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ];

      setChartOptions(options);
      setChartSeries(series);
    }
  }, [revenueSummary, themeColors]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Generate year options
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Determine if we should show loading
  const showLoading = isLoading || isFetching;

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
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
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
          {!showLoading && revenueSummary?.success && (
            <div style={{ marginTop: "4px" }}>
              <span
                style={{
                  fontSize: "14px",
                  color: themeColors.textMuted,
                  marginRight: "12px",
                }}
              >
                Total:{" "}
                <strong style={{ color: themeColors.primary }}>
                  £
                  {(revenueSummary.summary?.total || 0).toLocaleString(
                    "en-GB",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </strong>
              </span>
              <span style={{ fontSize: "14px", color: themeColors.textMuted }}>
                Avg:{" "}
                <strong style={{ color: themeColors.primary }}>
                  £
                  {(revenueSummary.summary?.average || 0).toLocaleString(
                    "en-GB",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </strong>
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              disabled={showLoading}
              style={{
                padding: "6px 32px 6px 12px",
                borderRadius: "6px",
                border: `1px solid ${themeColors.border}`,
                backgroundColor: "white",
                color: themeColors.textPrimary,
                fontSize: "14px",
                fontWeight: 500,
                cursor: showLoading ? "not-allowed" : "pointer",
                appearance: "none",
                minWidth: "100px",
                opacity: showLoading ? 0.7 : 1,
              }}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: themeColors.textMuted,
              }}
            >
              ▼
            </div>
            {showLoading && (
              <div
                style={{
                  position: "absolute",
                  right: "32px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    border: `2px solid ${themeColors.border}`,
                    borderTopColor: themeColors.primary,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: "250px", position: "relative" }}>
        {showLoading ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: themeColors.textMuted,
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: `3px solid ${themeColors.border}`,
                borderTopColor: themeColors.primary,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div>Loading revenue data for {selectedYear}...</div>
          </div>
        ) : chartOptions && chartSeries ? (
          <>
            <ApexCharts
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={250}
            />

            {/* Zero revenue warning - only show if we have data but total is 0 */}
            {revenueSummary?.success && revenueSummary.summary?.total === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: themeColors.textMuted,
                  fontSize: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                No revenue data available for {selectedYear}
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: themeColors.textMuted,
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: `3px solid ${themeColors.border}`,
                borderTopColor: themeColors.primary,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div>Initializing chart...</div>
          </div>
        )}
      </div>

      {/* Month highlights */}
      {!showLoading &&
        revenueSummary?.success &&
        revenueSummary.summary?.total > 0 && (
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: `1px solid ${themeColors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "12px", color: themeColors.textMuted }}>
                Peak Month:{" "}
                <strong style={{ color: themeColors.primary }}>
                  {(() => {
                    const maxValue = Math.max(...revenueSummary.series[0].data);
                    const maxIndex =
                      revenueSummary.series[0].data.indexOf(maxValue);
                    return revenueSummary.categories[maxIndex];
                  })()}
                </strong>
              </span>
              <span style={{ fontSize: "12px", color: themeColors.textMuted }}>
                Active Months:{" "}
                <strong style={{ color: themeColors.primary }}>
                  {
                    revenueSummary.series[0].data.filter((val) => val > 0)
                      .length
                  }
                </strong>
              </span>
              <span style={{ fontSize: "12px", color: themeColors.textMuted }}>
                Highest Revenue:{" "}
                <strong style={{ color: themeColors.primary }}>
                  £
                  {Math.max(...revenueSummary.series[0].data).toLocaleString(
                    "en-GB",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </strong>
              </span>
            </div>
          </div>
        )}
    </div>
  );
};

export default RevenueAnalytics;
