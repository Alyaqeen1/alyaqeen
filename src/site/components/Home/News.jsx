import { Link } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUssunnah } from "react-icons/fa";
import { IoMoonOutline, IoSunny, IoSunnyOutline } from "react-icons/io5";
import { MdSunnySnowing } from "react-icons/md";
import { useGetPrayerTimesQuery } from "../../../redux/features/prayer_times/prayer_timesApi";
import LoadingSpinner from "../LoadingSpinner";
import { useGetAnnouncementPublicLatestQuery } from "../../../redux/features/announcements/announcementsApi";

const News = () => {
  const { data: announcement, isLoading: latestUpdateLoading } =
    useGetAnnouncementPublicLatestQuery();

  const [formattedTime, setFormattedTime] = useState("");
  const { data: times, isLoading } = useGetPrayerTimesQuery();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getFormattedTime = () => {
    const date = new Date();
    return new Intl.DateTimeFormat("en-US", {
      timeZone: userTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Function to create safe HTML content with length limit
  // Function to create safe HTML content with length limit - PRESERVES FORMATTING
  const createLimitedHtmlContent = (html, maxLength = 450) => {
    if (!html) return { __html: "" };

    // Strip HTML tags only to check length (don't modify the HTML yet)
    const plainText = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>|<p>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // If content is short enough, return the original HTML with formatting
    if (plainText.length <= maxLength) {
      return { __html: html };
    }

    // If content is too long, we need to truncate intelligently while preserving HTML
    // This is more complex - we'll create a DOM parser to handle it properly

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Function to extract text up to maxLength while preserving HTML structure
    const truncateHtml = (element, remainingChars) => {
      if (remainingChars <= 0) return { html: "", remaining: 0 };

      let result = "";

      for (const child of element.childNodes) {
        if (remainingChars <= 0) break;

        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          if (text.length <= remainingChars) {
            result += text;
            remainingChars -= text.length;
          } else {
            result += text.substring(0, remainingChars) + "...";
            remainingChars = 0;
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const tagName = child.tagName.toLowerCase();
          const attributes = Array.from(child.attributes)
            .map((attr) => `${attr.name}="${attr.value}"`)
            .join(" ");

          const startTag = attributes
            ? `<${tagName} ${attributes}>`
            : `<${tagName}>`;
          const { html: childHtml, remaining: childRemaining } = truncateHtml(
            child,
            remainingChars
          );

          result += startTag + childHtml;
          if (childRemaining > 0) {
            result += `</${tagName}>`;
          }
          remainingChars = childRemaining;
        }
      }

      return { html: result, remaining: remainingChars };
    };

    const { html: truncatedHtml } = truncateHtml(tempDiv, maxLength);

    return { __html: truncatedHtml };
  };

  // Function to check if content needs truncation
  const needsTruncation = (html, maxLength = 450) => {
    if (!html) return false;

    const plainText = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>|<p>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return plainText.length > maxLength;
  };

  // Check if announcement has content AND needs truncation (shows "Read More" only when there's more to read)
  const showReadMore =
    announcement?.content && needsTruncation(announcement.content, 450);

  useEffect(() => {
    setFormattedTime(getFormattedTime()); // initial set

    const interval = setInterval(() => {
      setFormattedTime(getFormattedTime()); // update every second
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  // Date parts
  const date = new Date();
  const currentDate = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    day: "2-digit",
  }).format(date);

  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    month: "long",
  }).format(date);

  const todayTimes = times?.[0]?.[currentMonthName]?.find(
    (day) => day?.date == currentDate
  );

  const getDateSuffix = (date) => {
    if (date > 3 && date < 21) return "th";
    switch (date % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  if (isLoading || latestUpdateLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  // Check if announcement has content to show "Read More"
  const hasContent =
    announcement?.content &&
    announcement.content.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <section className="news-section section-padding fix" id="blog">
      <div className="container">
        <div className="news-wrapper">
          <div className="row align-items-center">
            {/* announcement section */}
            <div className="col-lg-6 order-2 order-lg-1 p-3">
              <div className="testimonial-wrapper section-padding-feb11-news-home-page">
                <div className="testimonial-bg-feb17"></div>

                <div className="section-title text-center">
                  <span data-aos-duration="800" data-aos="fade-up">
                    Announcements
                  </span>

                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="mb-4"
                  >
                    {announcement?.title || "Latest Update"}
                  </h2>
                </div>

                <div
                  className="px-2 announcement-content"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  style={{
                    lineHeight: "1.6",
                    fontSize: "16px",
                    color: "#333",
                    // maxHeight: "200px",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={createLimitedHtmlContent(
                    announcement?.content,
                    450
                  )}
                ></div>

                {showReadMore && (
                  <div
                    className="read-more-wrapper-div mt-5"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Link
                      to={`/announcement-details/${announcement?._id}`}
                      className="theme-btn"
                    >
                      Read More <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                )}

                {announcement?.lastUpdated && (
                  <span className="text-end d-block mt-5">
                    <ul className="pe-2 pe-md-2 pe-lg-2">
                      <li>Last Updated: {announcement?.lastUpdated}</li>
                    </ul>
                  </span>
                )}
              </div>
            </div>

            {/* best teacher and best student of the month section */}
            <div className="col-xl-6 col-lg-8 order-1 order-lg-2 mt-5 mt-xl-0">
              <div>
                <h3 className="fs-2 text-center mb-1">Prayer Times</h3>
                <div className="d-flex justify-content-between align-items-center">
                  <Link
                    to="/prayer-timetable?tab=calendar"
                    className="theme-btn"
                  >
                    Prayer Calendar
                  </Link>
                  <Link
                    to="/prayer-timetable?tab=monthly"
                    className="theme-btn"
                  >
                    Prayer Timetable
                  </Link>
                </div>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <div className="mt-2">
                    <p className="fw-bolder text-black">Current Date</p>
                    <p style={{ color: "var(--theme)" }} className="fs-5">
                      {currentMonthName} {currentDate}
                      {getDateSuffix(currentDate)}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="fw-bolder text-black">Current Time</p>
                    <p style={{ color: "var(--theme)" }} className="fs-5">
                      {formattedTime}
                    </p>
                  </div>
                </div>

                <div className="table-responsive mb-3 border-0">
                  <table className="table mb-0 border-0">
                    <thead>
                      <tr>
                        <th className="font-danger text-white fw-bolder h6 text-center align-middle"></th>
                        <th className="font-danger text-white fw-bolder h6 text-center align-middle"></th>
                        <th
                          className="font-danger text-white fw-bolder text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          Start
                        </th>
                        <th
                          className="font-danger text-white fw-bolder text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          Jamat
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border border-white">
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle text-uppercase py-3 fw-bolder"
                        >
                          Fajr
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          <FaUssunnah
                            className="fs-3"
                            style={{ color: "var(--theme)" }}
                          />
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          {todayTimes?.fajr?.start || "N/A"}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle"
                        >
                          {todayTimes?.fajr?.jamat || "N/A"}
                        </td>
                      </tr>

                      <tr className="border border-white">
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle text-uppercase py-3 fw-bolder"
                        >
                          zuhr
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          <IoSunnyOutline
                            className="fs-3"
                            style={{ color: "var(--theme)" }}
                          />
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          {todayTimes?.zuhr?.start || "N/A"}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className=" h6 text-center align-middle"
                        >
                          {todayTimes?.zuhr?.jamat || "N/A"}
                        </td>
                      </tr>
                      <tr className="border border-white">
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle text-uppercase py-3 fw-bolder"
                        >
                          asr
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          <IoSunny
                            className="fs-3"
                            style={{ color: "var(--theme)" }}
                          />
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          {todayTimes?.asr?.start || "N/A"}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className=" h6 text-center align-middle"
                        >
                          {todayTimes?.asr?.jamat || "N/A"}
                        </td>
                      </tr>
                      <tr className="border border-white">
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle text-uppercase py-3 fw-bolder"
                        >
                          maghrib
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          <MdSunnySnowing
                            className="fs-3"
                            style={{ color: "var(--theme)" }}
                          />
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          {todayTimes?.maghrib?.start || "N/A"}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle"
                        >
                          {todayTimes?.maghrib?.jamat || "N/A"}
                        </td>
                      </tr>
                      <tr className="border border-white">
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle text-uppercase py-3 fw-bolder"
                        >
                          isha
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          <IoMoonOutline
                            className="fs-3"
                            style={{ color: "var(--theme)" }}
                          />
                        </td>
                        <td className="bg-white h6 text-center align-middle">
                          {todayTimes?.isha?.start || "N/A"}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle"
                        >
                          {todayTimes?.isha?.jamat || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
