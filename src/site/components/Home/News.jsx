import { Link } from "react-router";
import React, { useEffect, useState } from "react";
import { FaUssunnah } from "react-icons/fa";
import { IoMoonOutline, IoSunny, IoSunnyOutline } from "react-icons/io5";
import { MdSunnySnowing } from "react-icons/md";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { useGetPrayerTimesQuery } from "../../../redux/features/prayer_times/prayer_timesApi";
import LoadingSpinner from "../LoadingSpinner";
import { useGetAnnouncementPublicLatestQuery } from "../../../redux/features/announcements/announcementsApi";
import { toHijri } from "hijri-converter"; // Add this import

// Utility function for parsing time strings
const parseTimeString = (timeStr, baseDate = new Date()) => {
  if (!timeStr) return null;

  try {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    // Create a new date with the same date as baseDate
    const date = new Date(baseDate);
    date.setHours(hour, parseInt(minutes), 0, 0);

    return date; // Return the local time directly
  } catch (error) {
    return null;
  }
};
// Add this function near your other utility functions
const getCurrentSeason = () => {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // April to October: Summer
  if (currentMonth >= 4 && currentMonth <= 10) {
    return "summer";
  }
  // November to March: Winter
  return "winter";
};
const News = () => {
  const { data: announcement, isLoading: latestUpdateLoading } =
    useGetAnnouncementPublicLatestQuery();

  const [formattedTime, setFormattedTime] = useState("");
  const { data: times, isLoading } = useGetPrayerTimesQuery();

  // Countdown state
  const [targetTime, setTargetTime] = useState(null);
  const [nextPrayer, setNextPrayer] = useState({
    name: "",
    time: "",
  });
  // Get Jumuah times based on season
  const currentSeason = getCurrentSeason();
  const jumuahTimes = times?.[0]?.jumuah?.[currentSeason];
  // Islamic date state
  const [islamicDate, setIslamicDate] = useState({
    day: "",
    month: "",
    year: "",
    monthName: "",
    formatted: "",
  });
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Function to get Islamic month name
  const getIslamicMonthName = (monthNumber) => {
    const islamicMonths = [
      "Muharram",
      "Safar",
      "Rabi' al-Awwal",
      "Rabi' al-Thani",
      "Jumada al-Awwal",
      "Jumada al-Thani",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah",
    ];
    return islamicMonths[monthNumber - 1] || "";
  };

  // Update Islamic date function
  const updateIslamicDate = () => {
    try {
      const now = new Date();
      const hijri = toHijri(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      );

      const monthName = getIslamicMonthName(hijri.hm);

      setIslamicDate({
        day: hijri.hd,
        month: hijri.hm,
        year: hijri.hy,
        monthName: monthName,
        formatted: `${hijri.hd} ${monthName} ${hijri.hy}`,
      });
    } catch (error) {
      console.error("Error converting to Hijri date:", error);
      // Fallback date
      setIslamicDate({
        day: "13",
        month: "7",
        year: "1447",
        monthName: "Rajab",
        formatted: "13 Rajab 1447",
      });
    }
  };

  useEffect(() => {
    setFormattedTime(getFormattedTime()); // initial set
    updateIslamicDate(); // Update Islamic date

    const interval = setInterval(() => {
      setFormattedTime(getFormattedTime()); // update every second
    }, 1000);

    // Update Islamic date at midnight
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const timeToMidnight = midnight.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      updateIslamicDate();
      // Set daily update
      const dailyInterval = setInterval(updateIslamicDate, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, timeToMidnight);

    return () => {
      clearInterval(interval);
      clearTimeout(midnightTimer);
    };
  }, []);
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
  const createLimitedHtmlContent = (html, maxLength = 450) => {
    if (!html) return { __html: "" };

    const plainText = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>|<p>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (plainText.length <= maxLength) {
      return { __html: html };
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

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

  // Check if announcement has content AND needs truncation
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
  const currentFullDate = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    day: "2-digit",
    month: "long",
    year: "numeric", // <-- add this
  }).format(date);

  const todayTimes = times?.[0]?.[currentMonthName]?.find(
    (day) => day?.date == currentDate
  );

  // Get tomorrow's times
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDateStr = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    day: "2-digit",
  }).format(tomorrowDate);

  const tomorrowMonthName = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimeZone,
    month: "long",
  }).format(tomorrowDate);

  const tomorrowTimes = times?.[0]?.[tomorrowMonthName]?.find(
    (day) => day?.date == tomorrowDateStr
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

  // Add these debug logs in your calculateNextPrayer function
  useEffect(() => {
    const calculateNextPrayer = () => {
      const now = new Date();
      // const now = new Date();
      // now.setHours(13, 0, 0, 0); // This modifies the Date object

      // If no times available at all
      if (!times || !times[0]) {
        setNextPrayer({
          name: "No prayer times",
          time: "",
        });
        setTargetTime(null);
        return;
      }

      // Define prayers in order for today (using JAMAT times if available)
      const prayersToday = todayTimes
        ? [
            {
              name: "Fajr",
              time: todayTimes.fajr?.jamat || todayTimes.fajr?.start,
              isToday: true,
              prayerDate: new Date(),
            },
            {
              name: "Zuhr",
              time: todayTimes.zuhr?.jamat || todayTimes.zuhr?.start,
              isToday: true,
              prayerDate: new Date(),
            },
            {
              name: "Asr",
              time: todayTimes.asr?.jamat || todayTimes.asr?.start,
              isToday: true,
              prayerDate: new Date(),
            },
            {
              name: "Maghrib",
              time: todayTimes.maghrib?.jamat || todayTimes.maghrib?.start,
              isToday: true,
              prayerDate: new Date(),
            },
            {
              name: "Isha",
              time: todayTimes.isha?.jamat || todayTimes.isha?.start,
              isToday: true,
              prayerDate: new Date(),
            },
          ]
        : [];

      // Find the next prayer from all available times
      let nextPrayerObj = null;
      let smallestDiff = Infinity;

      prayersToday.forEach((prayer) => {
        if (!prayer.time) return;

        const prayerTime = parseTimeString(prayer.time, prayer.prayerDate);

        if (prayerTime) {
          const diff = prayerTime.getTime() - now.getTime();

          if (diff > 0 && diff < smallestDiff) {
            smallestDiff = diff;
            nextPrayerObj = prayer;
          }
        }
      });

      // Check if we found a prayer for today
      if (nextPrayerObj) {
        const prayerTime = parseTimeString(
          nextPrayerObj.time,
          nextPrayerObj.prayerDate
        );
        if (prayerTime) {
          setTargetTime(prayerTime);
          setNextPrayer({
            name: nextPrayerObj.name,
            time: nextPrayerObj.time,
          });
        }
      } else {
        // No prayer found for today, check for tomorrow's Fajr
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const prayersTomorrow = tomorrowTimes
          ? [
              {
                name: "Fajr (Tomorrow)",
                time: tomorrowTimes.fajr?.jamat || tomorrowTimes.fajr?.start,
                isToday: false,
                prayerDate: tomorrow,
              },
            ]
          : [];

        if (prayersTomorrow[0]?.time) {
          const prayerTime = parseTimeString(
            prayersTomorrow[0].time,
            prayersTomorrow[0].prayerDate
          );
          setTargetTime(prayerTime.toISOString());
          setNextPrayer({
            name: prayersTomorrow[0].name,
            time: prayersTomorrow[0].time,
          });
        } else {
          setNextPrayer({
            name: "No prayer times available",
            time: "",
          });
          setTargetTime(null);
        }
      }
    };

    // Run calculation initially and every 30 seconds
    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 30000);
    return () => clearInterval(interval);
  }, [todayTimes, tomorrowTimes, times]);

  if (isLoading || latestUpdateLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <section
      className="news-section section-padding fix pt-4 pt-lg-5"
      id="blog"
    >
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
                <h3 className="fs-2 text-center mb-4">Prayer Times</h3>
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
                    Full Prayer Times
                  </Link>
                </div>
                {/* CURRENT DATE, COUNTDOWN, AND CURRENT TIME - RESPONSIVE LAYOUT */}
                <div className="my-3">
                  <div className="row align-items-center justify-content-center g-1">
                    {/* Mobile: Date and Time side by side */}
                    <div className="col-12 d-block d-md-none">
                      <div className="row g-1 mb-3">
                        <div className="col-6">
                          <div className="text-center h-100">
                            <p className="fw-bolder text-black mb-1 small">
                              Current Date
                            </p>
                            <div
                              className="d-flex flex-column justify-content-center"
                              style={{
                                backgroundColor: "var(--theme)",
                                color: "white",
                                padding: "4px 2px",
                                borderRadius: "8px",
                                minHeight: "50px",
                              }}
                            >
                              <p className="mb-0 fs-6">
                                {currentFullDate}
                                {/* {getDateSuffix(currentDate)} */}
                              </p>
                              {/* Islamic Date for Mobile */}
                              <p
                                className="mb-0 fs-7 mt-1"
                                style={{ opacity: 0.9 }}
                              >
                                {islamicDate.formatted}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center h-100">
                            <p className="fw-bolder text-black mb-1 small">
                              Current Time
                            </p>
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: "var(--theme)",
                                color: "white",
                                padding: "4px 2px",
                                borderRadius: "8px",
                                minHeight: "70px",
                              }}
                            >
                              <p className="mb-0 fs-6">{formattedTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Desktop: Date (Left), Counter (Middle), Time (Right) - ALL SAME HEIGHT */}
                    {/* Desktop: Date (Left), Counter (Middle), Time (Right) */}{" "}
                    <div className="col-12 d-none d-md-flex justify-content-between align-items-center">
                      {" "}
                      {/* Current Date - Left with Islamic Date */}{" "}
                      <div className="text-center">
                        {" "}
                        <p className="fw-bolder text-black">
                          Current Date
                        </p>{" "}
                        <div
                          style={{
                            backgroundColor: "var(--theme)",
                            color: "white",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            minWidth: "160px",
                          }}
                        >
                          {" "}
                          {/* Gregorian Date */}{" "}
                          <p className="fs-5 mb-1"> {currentFullDate}</p>{" "}
                          {/* Islamic Date with separator */}{" "}
                          <div
                            className="border-top pt-1"
                            style={{ borderColor: "rgba(255,255,255,0.3)" }}
                          >
                            {" "}
                            <p className="mb-0 fs-6" style={{ opacity: 0.9 }}>
                              {" "}
                              {islamicDate.formatted}{" "}
                            </p>{" "}
                            {/* Optional: Show Arabic version */}{" "}
                            {/* <p className="mb-0 fs-7" style={{ opacity: 0.7, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}> {islamicDate.formattedArabic} </p> */}{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>{" "}
                      {/* Countdown Timer with Flip Clock - Center */}{" "}
                      <div className="text-center mx-2">
                        {" "}
                        <p className="fw-bolder text-black mb-2">
                          {" "}
                          Time Until: {nextPrayer.name}{" "}
                        </p>{" "}
                        <div>
                          {" "}
                          {targetTime ? (
                            <div>
                              {" "}
                              <FlipClockCountdown
                                to={targetTime}
                                renderMap={[false, true, true, true]}
                                labels={["HOURS", "MINUTES", "SECONDS"]}
                                showSeparators={true}
                                labelStyle={{
                                  fontSize: "10px",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  marginTop: "6px",
                                }}
                                digitBlockStyle={{
                                  width: 42,
                                  height: 60,
                                  fontSize: 30,
                                  backgroundColor: "var(--theme)",
                                  color: "#fff",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                                }}
                                dividerStyle={{
                                  height: 1,
                                  backgroundColor: "rgba(255,255,255,0.4)",
                                }}
                                separatorStyle={{ size: 6, color: "#fff" }}
                              />{" "}
                            </div>
                          ) : (
                            <div className="fs-5 py-2">
                              {" "}
                              {nextPrayer.name === "No prayer times available"
                                ? "No prayer times available"
                                : "Calculating prayer times..."}{" "}
                            </div>
                          )}{" "}
                        </div>{" "}
                      </div>{" "}
                      {/* Current Time - Right */}{" "}
                      <div className="text-center">
                        {" "}
                        <p className="fw-bolder text-black">
                          Current Time
                        </p>{" "}
                        <div
                          style={{
                            backgroundColor: "var(--theme)",
                            color: "white",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            minWidth: "140px",
                          }}
                        >
                          {" "}
                          <p className="fs-5 mb-0">{formattedTime}</p>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>
                    {/* Mobile: Counter below Date/Time */}
                    <div className="col-12 d-block d-md-none">
                      {" "}
                      <div className="text-center">
                        {" "}
                        <p className="fw-bolder text-black mb-2">
                          {" "}
                          Time Until: {nextPrayer.name}{" "}
                        </p>{" "}
                        <div>
                          {targetTime ? (
                            <div className="d-flex justify-content-center">
                              {" "}
                              <FlipClockCountdown
                                to={targetTime}
                                renderMap={[false, true, true, true]}
                                labels={["HOURS", "MINUTES", "SECONDS"]}
                                showSeparators={true}
                                labelStyle={{
                                  fontSize: "8px",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  marginTop: "4px",
                                }}
                                digitBlockStyle={{
                                  width: 36,
                                  height: 50,
                                  fontSize: 24,
                                  backgroundColor: "var(--theme)",
                                  color: "#fff",
                                  borderRadius: "6px",
                                  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                                }}
                                dividerStyle={{
                                  height: 1,
                                  backgroundColor: "rgba(255,255,255,0.4)",
                                }}
                                separatorStyle={{ size: 4, color: "#fff" }}
                              />{" "}
                            </div>
                          ) : (
                            <div className="fs-6 py-2">
                              {" "}
                              {nextPrayer.name === "No prayer times available"
                                ? "No prayer times available"
                                : "Calculating prayer times..."}{" "}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prayer Times Table - TODAY'S TIMES */}
                <div className="table-responsive mb-3 border-0">
                  <table className="table mb-0 border-0">
                    <thead>
                      <tr>
                        <th
                          className="font-danger text-white fw-bolder h6 text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        >
                          Salah
                        </th>
                        <th
                          className="font-danger text-white fw-bolder h6 text-center align-middle"
                          style={{ backgroundColor: "var(--theme)" }}
                        ></th>
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
                          style={{
                            backgroundColor:
                              nextPrayer.name === "Fajr"
                                ? "white"
                                : "var(--theme)",
                            color:
                              nextPrayer.name === "Fajr"
                                ? "var(--theme)"
                                : "white",
                          }}
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
                          style={{
                            backgroundColor:
                              nextPrayer.name === "Zuhr"
                                ? "white"
                                : "var(--theme)",
                            color:
                              nextPrayer.name === "Zuhr"
                                ? "var(--theme)"
                                : "white",
                          }}
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
                          style={{
                            backgroundColor:
                              nextPrayer.name === "Asr"
                                ? "white"
                                : "var(--theme)",
                            color:
                              nextPrayer.name === "Asr"
                                ? "var(--theme)"
                                : "white",
                          }}
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
                          style={{
                            backgroundColor:
                              nextPrayer.name === "Maghrib"
                                ? "white"
                                : "var(--theme)",
                            color:
                              nextPrayer.name === "Maghrib"
                                ? "var(--theme)"
                                : "white",
                          }}
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
                          style={{
                            backgroundColor:
                              nextPrayer.name === "Isha"
                                ? "white"
                                : "var(--theme)",
                            color:
                              nextPrayer.name === "Isha"
                                ? "var(--theme)"
                                : "white",
                          }}
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
                  {/* Jumuah Prayer Times Notice */}
                  {jumuahTimes && (
                    <div className="mt-3 text-center">
                      <p
                        className="mb-1"
                        style={{
                          fontSize: "14px",
                          color: "var(--theme)",
                          fontWeight: 600,
                        }}
                      >
                        <strong>
                          Jumuah Prayer Times (
                          {currentSeason.charAt(0).toUpperCase() +
                            currentSeason.slice(1)}{" "}
                          Schedule):
                        </strong>
                      </p>
                      <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <span
                            className="badge "
                            style={{ backgroundColor: "var(--theme)" }}
                          >
                            1st:
                          </span>
                          <span>{jumuahTimes.first}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <span
                            className="badge "
                            style={{ backgroundColor: "var(--theme)" }}
                          >
                            2nd:
                          </span>
                          <span>{jumuahTimes.second}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <span
                            className="badge "
                            style={{ backgroundColor: "var(--theme)" }}
                          >
                            3rd:
                          </span>
                          <span>{jumuahTimes.third}</span>
                        </div>
                      </div>
                    </div>
                  )}
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
