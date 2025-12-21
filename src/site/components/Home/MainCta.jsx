import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import oneImg from "../../assets/img/plane.png";
import threeImg from "../../assets/img/cta/plane.png";
import fourImg from "../../assets/img/cta/shape.png";
import teacherOfTheYear from "../../assets/img/team/team02.png";
import { useGetWebsiteSectionQuery } from "../../../redux/features/website_settings/website_settingsApi";
import LoadingSpinner from "../LoadingSpinner";

const MainCta = () => {
  const { t } = useTranslation(["home", "common"]);

  // Fetch best teacher data from API
  const {
    data: bestTeacherData,
    isLoading,
    isError,
  } = useGetWebsiteSectionQuery("bestTeacher");

  // Get translation data as fallback
  const translationData = t("teacherOfTheYear") || {};
  const {
    name: defaultName = "Best Teacher",
    title: defaultTitle = "Teacher of the Month",
    description:
      defaultDescription = "Meet our exceptional teacher who goes above and beyond for students.",
    exploreBtn = "Explore More",
    skills = {
      one: "Dedicated teaching approach",
      two: "Student-centered methodology",
      three: "Innovative teaching techniques",
      four: "Excellent communication skills",
      five: "Strong subject knowledge",
      six: "Positive classroom environment",
      seven: "Continuous professional development",
    },
  } = translationData;

  const { name: directorName, post } = t("director", { ns: "common" }) || {};

  // Use API data if available, otherwise use translation data
  const teacherName = bestTeacherData?.name || defaultName;
  const teacherTitle = bestTeacherData?.designation || defaultTitle;
  const teacherDescription = bestTeacherData?.description || defaultDescription;
  const teacherPhoto = bestTeacherData?.photo || teacherOfTheYear;
  const teacherQualities = bestTeacherData?.qualities || [];

  // Create skills list from qualities or default skills
  const getSkillsList = () => {
    if (teacherQualities.length > 0) {
      // Use the qualities from the API
      return teacherQualities.slice(0, 7).map((quality, index) => {
        const skillKeys = [
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
        ];
        return {
          key: skillKeys[index] || `skill${index + 1}`,
          text: quality,
        };
      });
    } else {
      // Use default skills from translation
      return Object.entries(skills).map(([key, text]) => ({ key, text }));
    }
  };

  const skillsList = getSkillsList();

  // Handle loading state
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  // Handle error state
  if (isError) {
    return (
      <section className="main-cta-section rounded-5">
        <div className="container">
          <div className="main-cta-wrapper section-padding">
            <div className="row g-5 px-lg-5 px-3 pt-0 rounded-5 mt-0 pt-0 pb-0 mb-0">
              <div className="col-lg-6 flex flex-column flex-lg-row pt-lg-0 justify-content-center align-items-center my-auto">
                <img
                  className="rounded-5 w-100"
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  style={{ height: "500px" }}
                  src={teacherOfTheYear}
                  alt="img"
                />
              </div>
              <div className="col-lg-6 text-white">
                <div className="alert alert-warning">
                  Could not load best teacher data. Showing default information.
                </div>
                <div className="about-content">
                  <div className="section-title">
                    <span
                      data-aos-duration="800"
                      data-aos="fade-up"
                      className="text-white"
                    >
                      {defaultName}
                    </span>
                    <h2
                      data-aos-duration="800"
                      data-aos="fade-up"
                      data-aos-delay="300"
                      className="text-white"
                    >
                      {defaultTitle}
                    </h2>
                  </div>
                  <p
                    className="mt-3 mt-md-0 "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    {defaultDescription}
                  </p>
                  {/* ... rest of the default content ... */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="main-cta-section rounded-5">
      <div className="plane-shape float-bob-y text-end">
        <img src={oneImg} className="w-50" alt="shape-img" />
      </div>
      <div className="container">
        <div className="main-cta-wrapper section-padding">
          <div className="plane-shape float-bob-y">
            <img src={threeImg} className="w-50" alt="img" />
          </div>
          <div className="cta-shape float-bob-x">
            <img src={fourImg} className="w-50" alt="img" />
          </div>
          <div className="cta-bg" style={{ borderRadius: "100px" }}></div>
          {/* changed newsletter section from here */}
          <div className="row g-5 px-lg-5 px-3 pt-0 rounded-5 mt-0 pt-0 pb-0 mb-0">
            <div className="col-lg-6 flex flex-column flex-lg-row pt-lg-0 justify-content-center align-items-center my-auto">
              <img
                className="rounded-5 w-100"
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="500"
                style={{
                  height: "500px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={teacherPhoto}
                alt={teacherName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = teacherOfTheYear;
                }}
              />
            </div>
            <div className="col-lg-6 text-white">
              <div className="about-content">
                <div className="section-title">
                  <span
                    data-aos-duration="800"
                    data-aos="fade-up"
                    className="text-white"
                  >
                    Why selected as The Best Teacher of the Year.
                  </span>
                  <h2
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="text-white"
                  >
                    {teacherName}
                  </h2>
                  <p
                    className="text-white mt-2"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    {teacherTitle}
                  </p>
                </div>
                <p
                  className="mt-3 mt-md-0 "
                  data-aos-duration="800"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  {teacherDescription}
                </p>

                {/* Show qualities from API if available */}
                {teacherQualities.length > 0 ? (
                  <ul
                    className="list-items "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    {teacherQualities.map((quality, index) => (
                      <li key={index} className="d-flex align-items-center">
                        <i className="fa-regular fa-circle-check me-2"></i>
                        {quality}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul
                    className="list-items "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    {skillsList.map((skill) => (
                      <li key={skill.key} className="d-flex align-items-center">
                        <i className="fa-regular fa-circle-check me-2"></i>
                        {skill.text}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="row mt-2 align-items-center">
                  <div
                    className="about-button col-lg-6"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <Link to="/about" className="theme-btn bg-white">
                      {exploreBtn}
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                  <div
                    className="author-image col-lg-6"
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="content">
                      <h6 className="text-white fw-bold">{directorName}</h6>
                      <p>{post}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCta;
