import React, { useEffect, useState } from "react";
import axios from "axios";
import one from "../../assets/img/section-top-shape.png";
import three from "../../assets/img/program/mask.png";
import four from "../../assets/img/program/pencil.png";
import five from "../../assets/img/program/mask-2.png";
import six from "../../assets/img/program/compass.png";
import { useGetPrayerTimesQuery } from "../../../redux/features/prayer_times/prayer_timesApi";
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate, useSearchParams } from "react-router";
import timetableImage from "../../assets/img/December_2025_img_page-0001.jpg"; // Add this image import
import timetablePDF from "/file/December_2025_img.pdf"; // Add this image import
import { useGetWebsiteSectionQuery } from "../../../redux/features/website_settings/website_settingsApi";

const PrayerComp = () => {
  const { data: prayerCalendar, refetch } =
    useGetWebsiteSectionQuery("prayerCalendar");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromURL = searchParams.get("tab"); // Get tab from URL

  // Initialize activeTab based on URL or default to 0
  const [activeTabIndex, setActiveTabIndex] = useState(
    tabFromURL === "calendar" ? 1 : 0
  );

  const date = new Date();
  const { data: times, isLoading, isError } = useGetPrayerTimesQuery();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    day: "2-digit",
  }).format(date);
  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    month: "long",
  }).format(date);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);

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

  // Update URL when tab changes
  const handleTabClick = (index) => {
    setActiveTabIndex(index);
    // Update URL query parameter
    const tabValue = index === 0 ? "monthly" : "calendar";
    navigate(`?tab=${tabValue}`);
  };

  // Sync with URL changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "calendar") {
      setActiveTabIndex(1);
    } else if (tabParam === "monthly" || !tabParam) {
      setActiveTabIndex(0);
    }
  }, [searchParams]);
  // Check if the file is a PDF
  const isPDFFile = () => {
    if (!prayerCalendar?.calendarFile) return false;
    const url = prayerCalendar.calendarFile.toLowerCase();
    return (
      url.endsWith(".pdf") || url.includes(".pdf") || url.includes("/pdf/")
    );
  };

  // Get file extension for download
  const getFileExtension = () => {
    if (!prayerCalendar?.calendarFile) return "";
    const url = prayerCalendar.calendarFile.toLowerCase();
    if (url.endsWith(".pdf") || url.includes(".pdf") || url.includes("/pdf/")) {
      return "pdf";
    }
    // Check for image extensions
    if (url.endsWith(".jpg") || url.includes(".jpg")) return "jpg";
    if (url.endsWith(".jpeg") || url.includes(".jpeg")) return "jpeg";
    if (url.endsWith(".png") || url.includes(".png")) return "png";
    if (url.endsWith(".gif") || url.includes(".gif")) return "gif";
    if (url.endsWith(".webp") || url.includes(".webp")) return "webp";
    return "file";
  };
  const handleDownload = async (url, extension) => {
    try {
      // For Cloudinary URLs, we need to modify them to force download
      let downloadUrl = url;

      // Check if it's a Cloudinary URL
      if (url.includes("cloudinary.com")) {
        // Add Cloudinary's force download parameter
        // Method 1: Add fl_attachment parameter
        const hasQuery = url.includes("?");
        downloadUrl = hasQuery
          ? `${url}&fl_attachment`
          : `${url}?fl_attachment`;

        // Method 2: Alternatively, use fetch API to download
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();

          // Create a blob URL and download it
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `prayer-calendar-${new Date()
            .toISOString()
            .slice(0, 10)}.${extension}`;
          document.body.appendChild(link);
          link.click();

          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);

          return; // Exit early if successful
        } catch (fetchError) {
          console.log("Fetch method failed, trying direct download");
        }
      }

      // Fallback method for direct download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `prayer-calendar-${new Date()
        .toISOString()
        .slice(0, 10)}.${extension}`;
      link.target = "_blank"; // Open in new tab as fallback

      // Append, click, and remove
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
      }, 10);
    } catch (error) {
      console.error("Download failed:", error);

      // Ultimate fallback: open in new tab
      window.open(url, "_blank");
    }
  };
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (isError || !times || times.length === 0) {
    return <p>Prayer times data could not be loaded.</p>;
  }

  return (
    <section
      className="program-section-feb-24 section-padding section-bg-2 fix bg-white"
      id="programs"
    >
      <div className="top-shape">
        <img src={one} className="w-75" alt="shape-img" />
      </div>

      <div className="mask-shape float-bob-x">
        <img src={three} className="w-50" alt="shape-img" />
      </div>

      <div className="mask-shape-2 text-end">
        <img src={five} className="w-50" alt="shape-img" />
      </div>

      <div className="container">
        <div className="section-title text-center mt-60">
          <span data-aos-duration="800" data-aos="fade-up">
            {/*Our Programs*/}
            {/*Classes &amp; Fee Structure*/} Time Table
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            Time Table
          </h2>
        </div>

        <div className="pricing-wrapper">
          <ul
            className="nav gap-2 my-md-5 my-0 flex justify-content-center align-items-center"
            role="tablist"
          >
            <li
              className="nav-item "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
              role="presentation"
            >
              <button
                className={`nav-link text-uppercase box-shadow px-3 ${
                  activeTabIndex === 0 ? " active" : ""
                }`}
                onClick={() => handleTabClick(0)}
              >
                Monthly Timetable
              </button>
            </li>
            <li
              className="nav-item "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="500"
              role="presentation"
            >
              <button
                className={`nav-link text-uppercase box-shadow px-3 ${
                  activeTabIndex === 1 ? " active" : ""
                }`}
                onClick={() => handleTabClick(1)}
              >
                Timetable Calendar
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTabIndex === 0 ? (
            // TAB 1: Monthly Timetable (Original Content)
            <div className="row">
              <div className="col-lg-2 d-flex flex-wrap flex-lg-column gap-2 month-button-group pb-3 pb-lg-0">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`month-btn theme-btn border ${
                      selectedMonth === month ? "" : "bg-white"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
              <div className="col-lg-10">
                <h3 className="mb-3">{selectedMonth} 2025</h3>
                <div className="table-responsive mb-3">
                  <table
                    className="table mb-0"
                    style={{
                      minWidth: 700,
                    }}
                  >
                    <thead>
                      <tr>
                        <th
                          rowSpan={2}
                          className="font-danger bg-white fw-bolder border h6 text-center align-middle"
                        >
                          Date
                        </th>
                        <th
                          colSpan={2}
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          FAJR
                        </th>
                        <th
                          rowSpan={2}
                          className="font-danger bg-white fw-bolder border h6 text-center align-middle"
                        >
                          Sunrise
                        </th>
                        <th
                          colSpan={2}
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          ZUHR
                        </th>
                        <th
                          colSpan={2}
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          ASR
                        </th>
                        <th
                          colSpan={2}
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          MAGHRIB
                        </th>
                        <th
                          colSpan={2}
                          className="font-danger text-white fw-bolder border h6 text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          ISHA
                        </th>
                      </tr>
                      <tr>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Start
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Jamat
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Start
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Jamat
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Start
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Jamat
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Start
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Jamat
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Start
                        </th>
                        <th className="font-danger bg-white fw-bolder border h6 text-center align-middle">
                          Jamat
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {times?.[0]?.[selectedMonth]?.length > 0 ? (
                        times[0][selectedMonth].map((day) => (
                          <tr key={day?.date}>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.date}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.fajr?.start}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.fajr?.jamat}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.sunrise}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.zuhr?.start}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.zuhr?.jamat}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.asr?.start}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.asr?.jamat}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.maghrib?.start}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.maghrib?.jamat}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.isha?.start}
                            </td>
                            <td
                              className={`${
                                currentDate == day?.date &&
                                currentMonthName === selectedMonth
                                  ? "bg-body-secondary"
                                  : "bg-white"
                              } border h6 text-center align-middle text-nowrap`}
                            >
                              {day?.isha?.jamat}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12}>
                            <h5>No prayer times available for this month.</h5>
                          </td>
                        </tr>
                      )}
                      {}
                    </tbody>
                  </table>
                </div>
                <hr />
                <div
                  style={{ backgroundColor: "var(--theme)" }}
                  className="p-4 text-white rounded-4"
                >
                  <div className="d-flex justify-content-between">
                    <div className="mt-5">
                      <h5>Summer Jumu'ah Timetable:</h5>
                      <p>1st Jama'ah at {times?.[0]?.jumuah?.summer?.first}</p>
                      <p>2nd Jama'ah at {times?.[0]?.jumuah?.summer?.second}</p>
                      <p>3rd Jama'ah at {times?.[0]?.jumuah?.summer?.third}</p>
                    </div>
                    <h3>Jumuah Information</h3>
                    <div className="mt-5">
                      <h5>Winter Jumu'ah Timetable:</h5>
                      <p>1st Jama'ah at {times?.[0]?.jumuah?.winter?.first}</p>
                      <p>2nd Jama'ah at {times?.[0]?.jumuah?.winter?.second}</p>
                      <p>3rd Jama'ah at {times?.[0]?.jumuah?.winter?.third}</p>
                    </div>
                  </div>
                  <h5 className="mt-4 text-center">
                    Please note: Friday Khutbah starts 5 minutes before
                    congregation.
                  </h5>
                </div>
              </div>
            </div>
          ) : (
            // TAB 2: Timetable Calendar (Image with Download)
            <div className="timetable-calendar-section">
              <div className="row justify-content-center">
                <div className="col-12">
                  {/* Download Button - Only show if there's a calendar file */}
                  {prayerCalendar?.calendarFile && (
                    <div className="text-center mb-4">
                      <button
                        onClick={() =>
                          handleDownload(
                            prayerCalendar.calendarFile,
                            getFileExtension()
                          )
                        }
                        className="theme-btn"
                      >
                        <i className="fas fa-download me-2"></i>
                        Download Timetable Calendar (
                        {getFileExtension().toUpperCase()})
                      </button>
                    </div>
                  )}

                  {/* Dynamic Content Display */}
                  {prayerCalendar?.calendarFile ? (
                    <div className="calendar-content-wrapper">
                      {isPDFFile() ? (
                        // PDF Display using iframe - FULL WIDTH
                        <div
                          className="pdf-preview-container"
                          style={{
                            width: "100%",
                            height: "80vh", // Use viewport height for responsive sizing
                            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            borderRadius: "8px",
                          }}
                        >
                          <iframe
                            src={prayerCalendar.calendarFile}
                            title="Timetable Calendar PDF"
                            className="w-100 h-100"
                            style={{ border: "none" }}
                          />
                        </div>
                      ) : (
                        // Image Display - FULL WIDTH
                        <div className="image-preview-container w-100">
                          <img
                            src={prayerCalendar.calendarFile}
                            alt="Timetable Calendar"
                            className="img-fluid w-100"
                            style={{
                              borderRadius: "8px",
                              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                              display: "block", // Ensure it's a block element
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    // No calendar file uploaded
                    <div className="text-center py-5">
                      <div className="alert alert-info">
                        <i className="fas fa-calendar-alt fa-3x mb-3 text-muted"></i>
                        <h4>No Timetable Calendar Available</h4>
                        <p className="mb-0">
                          The prayer timetable calendar has not been uploaded
                          yet.
                        </p>
                        <p>
                          Please check back later or contact the administration.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PrayerComp;
