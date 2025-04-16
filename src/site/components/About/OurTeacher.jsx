import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const OurTeacher = () => {
  const { t } = useTranslation(["home"]);
  const [staffData, setStaffData] = useState([]);
  useEffect(() => {
    axios("/staff.json")
      .then((res) => setStaffData(res.data))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);
  return (
    <section className="team-section-4 fix section-padding">
      <div className="container">
        <div className="row g-4">
          {staffData.map((single_data) => (
            <div
              className="col-xl-3 col-lg-4 col-md-6 "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="team-items mt-0">
                <div className="team-image">
                  <div className="shape-img">
                    <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/team/team-shape.png"
                      alt="img"
                    />
                  </div>
                  <img src={single_data?.image_link} alt="team-img" />
                  <div className="social-profile">
                    <span
                      className="plus-btn"
                      style={{ borderColor: "var(--theme)" }}
                    >
                      <i
                        className="fas fa-share-alt"
                        style={{ color: "var(--theme)" }}
                      ></i>
                    </span>
                    <ul>
                      <li>
                        <Link href={single_data?.fb_link}>
                          <i className="fab fa-facebook-f"></i>
                        </Link>
                      </li>
                      <li>
                        <Link href={single_data?.instagram_link}>
                          <i className="fa-brands fa-instagram"></i>
                        </Link>
                      </li>
                      <li>
                        <Link href={single_data?.linkedin_link}>
                          <i className="fab fa-linkedin-in"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="team-content">
                  <h3>
                    <Link to={`/staff-details/${single_data?.id}`}>
                      {t(single_data?.name)}
                    </Link>
                  </h3>
                  <p>{t(single_data?.post_of_staff)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeacher;
