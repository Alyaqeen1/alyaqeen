import one from "../../assets/img/team/team-shape.png";
import two from "../../assets/img/team/01.jpg";
import three from "../../assets/img/team/02.jpg";
import four from "../../assets/img/team/03.jpg";
import five from "../../assets/img/team/04.jpg";
import six from "../../assets/img/team/05.jpg";
import seven from "../../assets/img/team/06.jpg";
import eight from "../../assets/img/team/07.jpg";
import nine from "../../assets/img/team/08.jpg";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const OurTeacher = () => {
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
                    <img src={one} alt="img" />
                  </div>
                  <img src={single_data.image_link} alt="team-img" />
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
                        <Link href={single_data.fb_link}>
                          <i className="fab fa-facebook-f"></i>
                        </Link>
                      </li>
                      <li>
                        <Link href={single_data.instagram_link}>
                          <i className="fa-brands fa-instagram"></i>
                        </Link>
                      </li>
                      <li>
                        <Link href={single_data.linkedin_link}>
                          <i className="fab fa-linkedin-in"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="team-content">
                  <h3>
                    <Link to={`/staff-details/${single_data.id}`}>
                      {single_data.name}
                    </Link>
                  </h3>
                  <p>{single_data.post_of_staff}</p>
                </div>
              </div>
            </div>
          ))}
          {/* <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={two} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Brooklyn Simmons</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={three} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Leslie Alexander</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={four} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Ronald Richards</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={five} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Kristin Watson</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={six} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Esther Howard</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={seven} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Savannah Nguyen</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={eight} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Dianne Russell</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 "
            data-aos-duration="800"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <div className="team-items mt-0">
              <div className="team-image">
                <div className="shape-img">
                  <img src={one} alt="img" />
                </div>
                <img src={nine} alt="team-img" />
                <div className="social-profile">
                  <span className="plus-btn">
                    <i className="fas fa-share-alt"></i>
                  </span>
                  <ul>
                    <li>
                      <Link to="/">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h3>
                  <Link to="team-details">Kathryn Murphy</Link>
                </h3>
                <p>Instructors</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default OurTeacher;
