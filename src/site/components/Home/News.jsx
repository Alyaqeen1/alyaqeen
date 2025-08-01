import { Link } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUssunnah } from "react-icons/fa";
import { IoMoonOutline, IoSunny, IoSunnyOutline } from "react-icons/io5";
import { MdSunnySnowing } from "react-icons/md";
import { useGetPrayerTimesQuery } from "../../../redux/features/prayer_times/prayer_timesApi";
import LoadingSpinner from "../LoadingSpinner";

const News = () => {
  // const [times, setTimes] = useState([]);
  const [formattedTime, setFormattedTime] = useState(""); // ⬅️ add this
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

  useEffect(() => {
    setFormattedTime(getFormattedTime()); // initial set

    const interval = setInterval(() => {
      setFormattedTime(getFormattedTime()); // update every second
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data } = await axios.get("/prayerTimes.json");
  //     setTimes(data);
  //   };
  //   fetchData();
  // }, []);

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

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <section className="news-section section-padding fix" id="blog">
      <div className="container">
        {/* <div className="section-title-area">
          <div className="section-title">
            <span data-aos-duration="800" data-aos="fade-up">
              Our Blogs
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              Explore blogs and news
            </h2>
          </div>
          <Link
            to="news"
            className="theme-btn "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            See All Article <i className="fa-solid fa-arrow-right-long"></i>
          </Link>
        </div> */}
        <div className="news-wrapper">
          <div className="row align-items-center">
            {/* announcement section */}
            <div className="col-lg-6 p-3">
              <div className="testimonial-wrapper section-padding-feb11-news-home-page">
                <div className="testimonial-bg-feb17"></div>
                <div className="section-title text-center">
                  <span data-aos-duration="800" data-aos="fade-up">
                    News & Updates
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Academy&apos;s update
                  </h2>
                </div>
                <div className="px-2">
                  <p
                    className="pb-3"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    Alyaqeen Academy will be open as usual from today,
                    inshaAllah.
                  </p>

                  <p
                    className="pb-3"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    However, due to the weather warning forecast, it is up to
                    you whether to send your child or not. Absences will be
                    authorized, but rest assured, the academy will provide a
                    safe and warm environment for those who attend.
                  </p>

                  <p
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    However, due to the weather warning forecast, it is up to
                    you whether to send your child or not. Abs ...
                  </p>
                </div>

                <div
                  className="read-more-wrapper-div mt-5"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Link to="/announcements" className="theme-btn">
                    Read More <i className="fa-solid fa-arrow-right-long"></i>
                  </Link>
                </div>

                <p
                  className="mt-3 px-2 px-md-2 px-lg-2"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  Jazakum Allahu khayran
                </p>

                <span
                  className={"text-end"}
                  data-aos-duration="800"
                  data-aos="fade-up"
                >
                  <ul className={"pe-2 pe-md-2 pe-lg-2"}>
                    <li className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox={`0 0 20 20`}
                        fill="none"
                        width="20px"
                        height="20px"
                        // style={{ width: "10px" }}
                        // className="w-25"
                      >
                        <path
                          d="M6.66406 4.7915C6.3224 4.7915 6.03906 4.50817 6.03906 4.1665V1.6665C6.03906 1.32484 6.3224 1.0415 6.66406 1.0415C7.00573 1.0415 7.28906 1.32484 7.28906 1.6665V4.1665C7.28906 4.50817 7.00573 4.7915 6.66406 4.7915ZM13.3307 4.7915C12.9891 4.7915 12.7057 4.50817 12.7057 4.1665V1.6665C12.7057 1.32484 12.9891 1.0415 13.3307 1.0415C13.6724 1.0415 13.9557 1.32484 13.9557 1.6665V4.1665C13.9557 4.50817 13.6724 4.7915 13.3307 4.7915ZM7.08073 12.0832C6.9724 12.0832 6.86406 12.0582 6.76406 12.0165C6.65573 11.9748 6.5724 11.9165 6.48906 11.8415C6.33906 11.6832 6.2474 11.4748 6.2474 11.2498C6.2474 11.1415 6.2724 11.0332 6.31406 10.9332C6.35573 10.8332 6.41406 10.7415 6.48906 10.6582C6.5724 10.5832 6.65573 10.5248 6.76406 10.4832C7.06406 10.3582 7.43906 10.4248 7.6724 10.6582C7.8224 10.8165 7.91406 11.0332 7.91406 11.2498C7.91406 11.2998 7.90573 11.3582 7.8974 11.4165C7.88906 11.4665 7.8724 11.5165 7.8474 11.5665C7.83073 11.6165 7.80573 11.6665 7.7724 11.7165C7.7474 11.7582 7.70573 11.7998 7.6724 11.8415C7.51406 11.9915 7.2974 12.0832 7.08073 12.0832ZM9.9974 12.0832C9.88906 12.0832 9.78073 12.0582 9.68073 12.0165C9.5724 11.9748 9.48906 11.9165 9.40573 11.8415C9.25573 11.6832 9.16406 11.4748 9.16406 11.2498C9.16406 11.1415 9.18906 11.0332 9.23073 10.9332C9.2724 10.8332 9.33073 10.7415 9.40573 10.6582C9.48906 10.5832 9.5724 10.5248 9.68073 10.4832C9.98073 10.3498 10.3557 10.4248 10.5891 10.6582C10.7391 10.8165 10.8307 11.0332 10.8307 11.2498C10.8307 11.2998 10.8224 11.3582 10.8141 11.4165C10.8057 11.4665 10.7891 11.5165 10.7641 11.5665C10.7474 11.6165 10.7224 11.6665 10.6891 11.7165C10.6641 11.7582 10.6224 11.7998 10.5891 11.8415C10.4307 11.9915 10.2141 12.0832 9.9974 12.0832ZM12.9141 12.0832C12.8057 12.0832 12.6974 12.0582 12.5974 12.0165C12.4891 11.9748 12.4057 11.9165 12.3224 11.8415L12.2224 11.7165C12.1908 11.6701 12.1656 11.6196 12.1474 11.5665C12.1233 11.5193 12.1065 11.4687 12.0974 11.4165C12.0891 11.3582 12.0807 11.2998 12.0807 11.2498C12.0807 11.0332 12.1724 10.8165 12.3224 10.6582C12.4057 10.5832 12.4891 10.5248 12.5974 10.4832C12.9057 10.3498 13.2724 10.4248 13.5057 10.6582C13.6557 10.8165 13.7474 11.0332 13.7474 11.2498C13.7474 11.2998 13.7391 11.3582 13.7307 11.4165C13.7224 11.4665 13.7057 11.5165 13.6807 11.5665C13.6641 11.6165 13.6391 11.6665 13.6057 11.7165C13.5807 11.7582 13.5391 11.7998 13.5057 11.8415C13.3474 11.9915 13.1307 12.0832 12.9141 12.0832ZM7.08073 14.9998C6.9724 14.9998 6.86406 14.9748 6.76406 14.9332C6.66406 14.8915 6.5724 14.8332 6.48906 14.7582C6.33906 14.5998 6.2474 14.3832 6.2474 14.1665C6.2474 14.0582 6.2724 13.9498 6.31406 13.8498C6.35573 13.7415 6.41406 13.6498 6.48906 13.5748C6.7974 13.2665 7.36406 13.2665 7.6724 13.5748C7.8224 13.7332 7.91406 13.9498 7.91406 14.1665C7.91406 14.3832 7.8224 14.5998 7.6724 14.7582C7.51406 14.9082 7.2974 14.9998 7.08073 14.9998ZM9.9974 14.9998C9.78073 14.9998 9.56406 14.9082 9.40573 14.7582C9.25573 14.5998 9.16406 14.3832 9.16406 14.1665C9.16406 14.0582 9.18906 13.9498 9.23073 13.8498C9.2724 13.7415 9.33073 13.6498 9.40573 13.5748C9.71406 13.2665 10.2807 13.2665 10.5891 13.5748C10.6641 13.6498 10.7224 13.7415 10.7641 13.8498C10.8057 13.9498 10.8307 14.0582 10.8307 14.1665C10.8307 14.3832 10.7391 14.5998 10.5891 14.7582C10.4307 14.9082 10.2141 14.9998 9.9974 14.9998ZM12.9141 14.9998C12.6974 14.9998 12.4807 14.9082 12.3224 14.7582C12.2453 14.6799 12.1856 14.5862 12.1474 14.4832C12.1057 14.3832 12.0807 14.2748 12.0807 14.1665C12.0807 14.0582 12.1057 13.9498 12.1474 13.8498C12.1891 13.7415 12.2474 13.6498 12.3224 13.5748C12.5141 13.3832 12.8057 13.2915 13.0724 13.3498C13.1307 13.3582 13.1807 13.3748 13.2307 13.3998C13.2807 13.4165 13.3307 13.4415 13.3807 13.4748C13.4224 13.4998 13.4641 13.5415 13.5057 13.5748C13.6557 13.7332 13.7474 13.9498 13.7474 14.1665C13.7474 14.3832 13.6557 14.5998 13.5057 14.7582C13.3474 14.9082 13.1307 14.9998 12.9141 14.9998ZM17.0807 8.19984H2.91406C2.5724 8.19984 2.28906 7.9165 2.28906 7.57484C2.28906 7.23317 2.5724 6.94984 2.91406 6.94984H17.0807C17.4224 6.94984 17.7057 7.23317 17.7057 7.57484C17.7057 7.9165 17.4224 8.19984 17.0807 8.19984Z"
                          fill="#F39F5F"
                        />
                        <path
                          d="M13.3333 18.9582H6.66667C3.625 18.9582 1.875 17.2082 1.875 14.1665V7.08317C1.875 4.0415 3.625 2.2915 6.66667 2.2915H13.3333C16.375 2.2915 18.125 4.0415 18.125 7.08317V14.1665C18.125 17.2082 16.375 18.9582 13.3333 18.9582ZM6.66667 3.5415C4.28333 3.5415 3.125 4.69984 3.125 7.08317V14.1665C3.125 16.5498 4.28333 17.7082 6.66667 17.7082H13.3333C15.7167 17.7082 16.875 16.5498 16.875 14.1665V7.08317C16.875 4.69984 15.7167 3.5415 13.3333 3.5415H6.66667Z"
                          fill="#F39F5F"
                        />
                      </svg>
                      <span style={{ marginLeft: 10 }}>
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </li>
                  </ul>
                </span>
              </div>
            </div>
            {/* best teacher and best student of the month section */}
            <div className="col-xl-6 col-lg-8 mt-5 mt-xl-0">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="fs-2">Prayer Times</h3>
                  <Link to="/prayer-timetable" className="theme-btn">
                    Prayer Timetable
                  </Link>
                </div>
                <div className="d-flex justify-content-between align-items-center my-4">
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
                          {todayTimes?.fajr?.start}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle"
                        >
                          {todayTimes?.fajr?.jamat}
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
                          {todayTimes?.zuhr?.start}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className=" h6 text-center align-middle"
                        >
                          {todayTimes?.zuhr?.jamat}
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
                          {todayTimes?.asr?.start}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className=" h6 text-center align-middle"
                        >
                          {todayTimes?.asr?.jamat}
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
                          {todayTimes?.maghrib?.start}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle"
                        >
                          {todayTimes?.maghrib?.jamat}
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
                          {todayTimes?.isha?.start}
                        </td>
                        <td
                          style={{ backgroundColor: "var(--theme)" }}
                          className="h6 text-center align-middle"
                        >
                          {todayTimes?.isha?.jamat}
                        </td>
                      </tr>
                    </tbody>
                    <tbody></tbody>
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
