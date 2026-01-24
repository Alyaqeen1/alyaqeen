import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import img from "../../assets/image.png";

const CrmDashboard = ({
  teachersCount,
  studentsCount,
  staffPresence,
  studentPresence,
}) => {
  // Initialize chart states
  const [targetChart, setTargetChart] = useState(null);
  const [earnedChart, setEarnedChart] = useState(null);
  const [customersChart, setCustomersChart] = useState(null);
  const [revenueChart, setRevenueChart] = useState(null);
  const [ratioChart, setRatioChart] = useState(null);
  const [dealsChart, setDealsChart] = useState(null);
  const [revenueAnalyticsChart, setRevenueAnalyticsChart] = useState(null);
  const [sourceDataChart, setSourceDataChart] = useState(null);
  const [screenSize, setScreenSize] = useState("xl");
  const [jobsSummaryChart, setJobsSummaryChart] = useState(null);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1400) setScreenSize("xxl");
      else if (width >= 1200) setScreenSize("xl");
      else setScreenSize("lg");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Theme colors based on your style
  const themeColors = {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#06b6d4",
    dark: "#1e293b",
    light: "#f8fafc",
    border: "#e2e8f0",
    border2: "#64748b",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
  };

  const topDeals = [
    {
      id: 1,
      name: "Michael Jordan",
      email: "michael.jordan@example.com",
      amount: "$2,893",
    },
    {
      id: 2,
      name: "Emigo Kiaren",
      email: "emigo.kiaren@gmail.com",
      amount: "$4,289",
    },
    {
      id: 3,
      name: "Randy Origoan",
      email: "randy.origoan@gmail.com",
      amount: "$6,347",
    },
    {
      id: 4,
      name: "George Pieterson",
      email: "george.pieterson@gmail.com",
      amount: "$3,894",
    },
    {
      id: 5,
      name: "Kiara Advain",
      email: "kiaraadvain214@gmail.com",
      amount: "$2,679",
    },
  ];

  // Initialize charts
  useEffect(() => {
    // Target Chart (Donut)
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

    // Profit Earned Chart (Line)
    setEarnedChart({
      series: [
        {
          name: "Profit",
          data: [30, 40, 35, 50, 49, 60, 70],
        },
      ],
      options: {
        chart: {
          height: 200,
          type: "line",
          toolbar: {
            show: false,
          },
        },
        colors: [themeColors.success],
        stroke: {
          width: 3,
          curve: "smooth",
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          labels: {
            style: {
              colors: themeColors.textMuted,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: themeColors.textMuted,
            },
          },
        },
        grid: {
          borderColor: themeColors.border,
        },
      },
    });

    // Customers Chart (Sparkline)
    setCustomersChart({
      series: [
        {
          data: [30, 40, 35, 50, 49, 60, 70],
        },
      ],
      options: {
        chart: {
          type: "area",
          sparkline: {
            enabled: true,
          },
          height: 50,
        },
        colors: [themeColors.primary],
        stroke: {
          curve: "smooth",
          width: 2,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    });

    // Revenue Chart (Sparkline)
    setRevenueChart({
      series: [
        {
          data: [30, 25, 35, 40, 45, 50, 55],
        },
      ],
      options: {
        chart: {
          type: "area",
          sparkline: {
            enabled: true,
          },
          height: 50,
        },
        colors: [themeColors.secondary],
        stroke: {
          curve: "smooth",
          width: 2,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    });

    // Ratio Chart (Sparkline)
    setRatioChart({
      series: [
        {
          data: [30, 40, 35, 30, 25, 20, 15],
        },
      ],
      options: {
        chart: {
          type: "area",
          sparkline: {
            enabled: true,
          },
          height: 50,
        },
        colors: [themeColors.success],
        stroke: {
          curve: "smooth",
          width: 2,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    });

    // Deals Chart (Sparkline)
    setDealsChart({
      series: [
        {
          data: [30, 40, 35, 50, 49, 60, 70],
        },
      ],
      options: {
        chart: {
          type: "area",
          sparkline: {
            enabled: true,
          },
          height: 50,
        },
        colors: [themeColors.warning],
        stroke: {
          curve: "smooth",
          width: 2,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    });
    // Jobs Summary Chart (Donut) - Like the HRM page
    setJobsSummaryChart({
      series: [
        studentsCount?.session?.weekdays,
        studentsCount?.session?.weekend,
        studentsCount?.activity?.active,
        studentsCount?.activity?.inactive,
        studentsCount?.gender?.male,
        studentsCount?.gender?.female,
      ],
      options: {
        labels: ["Weekdays", "Weekend", "Active", "Inactive", "Male", "Female"],
        chart: {
          type: "donut",
          height: 240,
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "round",
          colors: ["#fff"],
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "70%",
              background: "transparent",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "20px",
                  color: themeColors.textPrimary,
                  offsetY: -4,
                },
                value: {
                  show: true,
                  fontSize: "18px",
                  color: undefined,
                  offsetY: 8,
                  formatter: function (val) {
                    return val + "%";
                  },
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: "Total",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: themeColors.textPrimary,
                  formatter: function () {
                    // Use studentsCount?.total
                    return studentsCount?.total || "0";
                  },
                },
              },
            },
          },
        },
        colors: [
          themeColors.primary,
          themeColors.success,
          themeColors.warning,
          themeColors.danger,
          themeColors.border2,
          themeColors.secondary,
        ],
      },
    });
    // Revenue Analytics Chart (Bar)
    setRevenueAnalyticsChart({
      series: [
        {
          name: "Revenue",
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 85, 95, 110],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 250,
          toolbar: {
            show: false,
          },
        },
        colors: [themeColors.primary],
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
            style: {
              colors: themeColors.textMuted,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: themeColors.textMuted,
            },
          },
        },
        grid: {
          borderColor: themeColors.border,
        },
      },
    });

    // Source Data Chart (Pie)
    setSourceDataChart({
      series: [
        teachersCount?.activity?.active,
        teachersCount?.activity?.inactive,
        teachersCount?.gender?.male,
        teachersCount?.gender?.female,
      ],
      options: {
        chart: {
          type: "pie",
          height: 250,
        },
        colors: [
          themeColors.primary,
          themeColors.success,
          themeColors.warning,
          themeColors.danger,
        ],
        labels: ["Active", "Inactive", "Male", "Female"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
  }, []);

  // Helper function to get color
  const getColor = (colorName) => {
    return themeColors[colorName] || colorName;
  };

  // Helper function for color classes
  const getBgColor = (colorName, opacity = 0.1) => {
    const color = getColor(colorName);
    return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
  };

  // Responsive grid logic based on screen size
  const getGridStyles = () => {
    if (screenSize === "xxl") {
      return {
        mainContainer: {
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "16px",
        },
        leftColumn: {
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "16px",
        },
        topDealsSection: { gridColumn: "span 4" },
        statsSection: { gridColumn: "span 8" },
        statsGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        },
        sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
      };
    } else if (screenSize === "xl") {
      return {
        mainContainer: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
        leftColumn: { display: "flex", flexDirection: "column", gap: "16px" },
        topDealsSection: { width: "100%" },
        statsSection: { width: "100%" },
        statsGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        },
        sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
      };
    } else {
      // For "lg" and smaller screens (mobile)
      return {
        mainContainer: {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        },
        leftColumn: { display: "flex", flexDirection: "column", gap: "16px" },
        topDealsSection: { width: "100%" },
        statsSection: { width: "100%" },
        statsGrid: {
          display: "grid",
          gridTemplateColumns: "1fr", // Single column on mobile
          gap: "16px",
        },
        sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
      };
    }
  };

  const gridStyles = getGridStyles();

  return (
    <div
      style={{
        padding: "20px",
        // backgroundColor: themeColors.light,
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          flexDirection: screenSize === "lg" ? "column" : "row",
          justifyContent: "space-between",
          alignItems: screenSize === "lg" ? "flex-start" : "center",
          marginBottom: "24px",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: 600,
              fontSize: "18px",
              margin: 0,
              color: themeColors.textPrimary,
            }}
          >
            Welcome back, Mohammad Khalid!
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: themeColors.textMuted,
              margin: "4px 0 0 0",
            }}
          >
            Track your LMS activity, leads and records here.
          </p>
        </div>
      </div>

      {/* Main Grid Container */}
      <div style={gridStyles.mainContainer}>
        {/* LEFT: Main Content (col-span-9 on xxl, col-span-12 on smaller) */}
        <div style={gridStyles.leftColumn}>
          {/* First Row: Top Deals + Profit Earned (col-span-4 on xxl) */}
          <div style={gridStyles.topDealsSection}>
            {/* Target Card */}
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
                  flexDirection: screenSize === "lg" ? "column" : "row",
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
                    Your target is incomplete
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      opacity: 0.8,
                      margin: "0 0 8px 0",
                    }}
                  >
                    You have completed{" "}
                    <span
                      style={{ color: themeColors.warning, fontWeight: 600 }}
                    >
                      48%
                    </span>{" "}
                    of the given target, you can also check your status.
                  </p>
                  <a
                    href="#!"
                    style={{
                      color: "white",
                      fontSize: "13px",
                      textDecoration: "underline",
                    }}
                  >
                    Click here
                  </a>
                </div>
                <div style={{ width: "50px", height: "50px", flexShrink: 0 }}>
                  {targetChart && (
                    <ApexCharts
                      options={targetChart.options}
                      series={targetChart.series}
                      type="donut"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Top Deals Card */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                border: `1px solid ${themeColors.border}`,
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    margin: 0,
                    color: themeColors.textPrimary,
                  }}
                >
                  Top Deals
                </h4>
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: themeColors.textMuted,
                  }}
                >
                  <i
                    className="bi bi-three-dots-vertical"
                    style={{ fontSize: "16px" }}
                  ></i>
                </button>
              </div>
              <div>
                {topDeals.map((deal) => (
                  <div
                    key={deal.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: `1px solid ${themeColors.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: getBgColor("primary", 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: themeColors.primary,
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        {deal.name.charAt(0)}
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: themeColors.textPrimary,
                          }}
                        >
                          {deal.name}
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0 0",
                            fontSize: "12px",
                            color: themeColors.textMuted,
                          }}
                        >
                          {deal.email}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: themeColors.textPrimary,
                      }}
                    >
                      {deal.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row: Stats Cards + Revenue Analytics (col-span-8 on xxl) */}
          <div style={gridStyles.statsSection}>
            {/* Stats Cards Grid */}
            <div style={gridStyles.statsGrid}>
              {/* Total Customers */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: getBgColor("primary", 0.2),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <i
                        className="bi bi-people-fill"
                        style={{
                          color: themeColors.primary,
                          fontSize: "20px",
                        }}
                      ></i>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
                            color: themeColors.textMuted,
                            margin: 0,
                          }}
                        >
                          Total Customers
                        </p>
                        <h3
                          style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            margin: "4px 0",
                            color: themeColors.textPrimary,
                          }}
                        >
                          1,02,890
                        </h3>
                      </div>
                      <div style={{ width: "80px", height: "40px" }}>
                        {customersChart && (
                          <ApexCharts
                            options={customersChart.options}
                            series={customersChart.series}
                            type="area"
                            height={40}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // marginTop: "16px",
                      }}
                    >
                      <a
                        href="#!"
                        style={{
                          color: themeColors.primary,
                          fontSize: "13px",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        View All
                        <i
                          className="bi bi-arrow-right"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </a>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            color: themeColors.success,
                            fontSize: "13px",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          +40%
                        </p>
                        <p
                          style={{
                            color: themeColors.textMuted,
                            fontSize: "11px",
                            margin: "2px 0 0 0",
                            opacity: 0.7,
                          }}
                        >
                          this month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: getBgColor("secondary", 0.2),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <i
                        className="bi bi-wallet-fill"
                        style={{
                          color: themeColors.secondary,
                          fontSize: "20px",
                        }}
                      ></i>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
                            color: themeColors.textMuted,
                            margin: 0,
                          }}
                        >
                          Total Revenue
                        </p>
                        <h3
                          style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            margin: "4px 0",
                            color: themeColors.textPrimary,
                          }}
                        >
                          $56,562
                        </h3>
                      </div>
                      <div style={{ width: "80px", height: "40px" }}>
                        {revenueChart && (
                          <ApexCharts
                            options={revenueChart.options}
                            series={revenueChart.series}
                            type="area"
                            height={40}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // marginTop: "16px",
                      }}
                    >
                      <a
                        href="#!"
                        style={{
                          color: themeColors.secondary,
                          fontSize: "13px",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        View All
                        <i
                          className="bi bi-arrow-right"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </a>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            color: themeColors.success,
                            fontSize: "13px",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          +25%
                        </p>
                        <p
                          style={{
                            color: themeColors.textMuted,
                            fontSize: "11px",
                            margin: "2px 0 0 0",
                            opacity: 0.7,
                          }}
                        >
                          this month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversion Ratio */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: getBgColor("success", 0.2),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <i
                        className="bi bi-graph-up-arrow"
                        style={{
                          color: themeColors.success,
                          fontSize: "20px",
                        }}
                      ></i>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
                            color: themeColors.textMuted,
                            margin: 0,
                          }}
                        >
                          Conversion Ratio
                        </p>
                        <h3
                          style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            margin: "4px 0",
                            color: themeColors.textPrimary,
                          }}
                        >
                          12.08%
                        </h3>
                      </div>
                      <div style={{ width: "80px", height: "40px" }}>
                        {ratioChart && (
                          <ApexCharts
                            options={ratioChart.options}
                            series={ratioChart.series}
                            type="area"
                            height={40}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // marginTop: "16px",
                      }}
                    >
                      <a
                        href="#!"
                        style={{
                          color: themeColors.success,
                          fontSize: "13px",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        View All
                        <i
                          className="bi bi-arrow-right"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </a>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            color: themeColors.danger,
                            fontSize: "13px",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          -12%
                        </p>
                        <p
                          style={{
                            color: themeColors.textMuted,
                            fontSize: "11px",
                            margin: "2px 0 0 0",
                            opacity: 0.7,
                          }}
                        >
                          this month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Deals */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: getBgColor("warning", 0.2),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <i
                        className="bi bi-briefcase-fill"
                        style={{
                          color: themeColors.warning,
                          fontSize: "20px",
                        }}
                      ></i>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginLeft: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
                            color: themeColors.textMuted,
                            margin: 0,
                          }}
                        >
                          Total Deals
                        </p>
                        <h3
                          style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            margin: "4px 0",
                            color: themeColors.textPrimary,
                          }}
                        >
                          2,543
                        </h3>
                      </div>
                      <div style={{ width: "80px", height: "40px" }}>
                        {dealsChart && (
                          <ApexCharts
                            options={dealsChart.options}
                            series={dealsChart.series}
                            type="area"
                            height={40}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // marginTop: "16px",
                      }}
                    >
                      <a
                        href="#!"
                        style={{
                          color: themeColors.warning,
                          fontSize: "13px",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        View All
                        <i
                          className="bi bi-arrow-right"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </a>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            color: themeColors.success,
                            fontSize: "13px",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          +19%
                        </p>
                        <p
                          style={{
                            color: themeColors.textMuted,
                            fontSize: "11px",
                            margin: "2px 0 0 0",
                            opacity: 0.7,
                          }}
                        >
                          this month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Analytics Card */}
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
                }}
              >
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                    }}
                  >
                    View All
                  </span>
                  <i
                    className="bi bi-chevron-down"
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                    }}
                  ></i>
                </div>
              </div>
              <div style={{ height: "250px" }}>
                {revenueAnalyticsChart && (
                  <ApexCharts
                    options={revenueAnalyticsChart.options}
                    series={revenueAnalyticsChart.series}
                    type="bar"
                    height={250}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar (col-span-3 on xxl, col-span-12 on smaller) */}
        <div style={gridStyles.sidebar}>
          {/* Leads By Source */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: 0,
                  color: themeColors.textPrimary,
                }}
              >
                Staff Details
              </h4>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: themeColors.textMuted,
                }}
              >
                <i
                  className="bi bi-three-dots-vertical"
                  style={{ fontSize: "16px" }}
                ></i>
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: "200px", height: "200px" }}>
                {sourceDataChart && (
                  <ApexCharts
                    options={sourceDataChart.options}
                    series={sourceDataChart.series}
                    type="pie"
                    height={200}
                  />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: themeColors.textMuted,
                      margin: 0,
                    }}
                  >
                    Total Staff
                  </p>
                  <p
                    style={{
                      fontSize: "25px",
                      fontWeight: 700,
                      margin: "4px 0 0 0",
                      color: themeColors.textPrimary,
                    }}
                  >
                    {teachersCount?.total}
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: themeColors.textMuted,
                      margin: 0,
                    }}
                  >
                    Today Present Staff
                  </p>
                  <p
                    style={{
                      fontSize: "25px",
                      fontWeight: 700,
                      margin: "4px 0 0 0",
                      color: themeColors.textPrimary,
                    }}
                  >
                    {staffPresence?.present_count}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  screenSize === "lg" ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                borderTop: `1px dashed ${themeColors.border}`,
              }}
            >
              <div
                style={{
                  padding: "2px",
                  textAlign: "center",
                  borderRight: `1px dashed ${themeColors.border}`,
                  borderBottom:
                    screenSize === "lg"
                      ? `1px dashed ${themeColors.border}`
                      : "none",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: themeColors.textMuted,
                    margin: "0 0 4px 0",
                  }}
                >
                  Active
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    margin: 0,
                    color: themeColors.textPrimary,
                  }}
                >
                  {teachersCount?.activity?.active}
                </p>
              </div>
              <div
                style={{
                  padding: "2px",
                  textAlign: "center",
                  borderRight:
                    screenSize === "lg"
                      ? `1px dashed ${themeColors.border}`
                      : "none",
                  borderBottom:
                    screenSize === "lg"
                      ? `1px dashed ${themeColors.border}`
                      : "none",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: themeColors.textMuted,
                    margin: "0 0 4px 0",
                  }}
                >
                  Inactive
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    margin: 0,
                    color: themeColors.textPrimary,
                  }}
                >
                  {teachersCount?.activity?.inactive}
                </p>
              </div>
              <div
                style={{
                  padding: "2px",
                  textAlign: "center",
                  borderRight: `1px dashed ${themeColors.border}`,
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: themeColors.textMuted,
                    margin: "0 0 4px 0",
                  }}
                >
                  Male
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    margin: 0,
                    color: themeColors.textPrimary,
                  }}
                >
                  {teachersCount?.gender?.male}
                </p>
              </div>
              <div
                style={{
                  padding: "2px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: themeColors.textMuted,
                    margin: "0 0 4px 0",
                  }}
                >
                  Female
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    margin: 0,
                    color: themeColors.textPrimary,
                  }}
                >
                  {teachersCount?.gender?.female}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {/* Jobs Summary Card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              border: `1px solid ${themeColors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // marginBottom: "20px",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: 0,
                  color: themeColors.textPrimary,
                }}
              >
                Student Details
              </h4>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: themeColors.textMuted,
                }}
              >
                <i
                  className="bi bi-three-dots-vertical"
                  style={{ fontSize: "16px" }}
                ></i>
              </button>
            </div>

            {/* Chart Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // marginBottom: "20px",
              }}
            >
              <div style={{ width: "100%", height: "240px" }}>
                {jobsSummaryChart && (
                  <ApexCharts
                    options={jobsSummaryChart.options}
                    series={jobsSummaryChart.series}
                    type="donut"
                    height={240}
                  />
                )}
              </div>

              <p className="mt-auto">
                Today Present Students:{" "}
                <strong>{studentPresence?.present_count}</strong>
              </p>
            </div>

            {/* Stats Grid - 4 columns in one line */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: "8px",
                borderTop: `1px dashed ${themeColors.border}`,
                paddingTop: "16px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: themeColors.primary,
                      marginBottom: "4px",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                      margin: "0 0 4px 0",
                    }}
                  >
                    Weekdays
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    {studentsCount?.session?.weekdays}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: themeColors.primary,
                      marginBottom: "4px",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                      margin: "0 0 4px 0",
                    }}
                  >
                    Weekends
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    {studentsCount?.session?.weekend}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: themeColors.primary,
                      marginBottom: "4px",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                      margin: "0 0 4px 0",
                    }}
                  >
                    Active
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    {studentsCount?.activity?.active}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: themeColors.success,
                      marginBottom: "4px",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                      margin: "0 0 4px 0",
                    }}
                  >
                    Inactive
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    {studentsCount?.activity?.inactive}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: themeColors.warning,
                      marginBottom: "4px",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                      margin: "0 0 4px 0",
                    }}
                  >
                    Male
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    {studentsCount?.gender?.male}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: themeColors.danger,
                      marginBottom: "4px",
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: themeColors.textMuted,
                      margin: "0 0 4px 0",
                    }}
                  >
                    Female
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      margin: 0,
                      color: themeColors.textPrimary,
                    }}
                  >
                    {studentsCount?.gender?.female}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmDashboard;
