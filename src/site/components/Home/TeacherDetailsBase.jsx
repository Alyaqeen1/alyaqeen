import { Link } from "react-router";
import { useState } from "react";

const TeacherDetailsBase = ({ staffData }) => {
  const {
    name,
    description_short_or_educational_info,
    navigation_link,
    fb_link,
    twitter_link,
    youtube_link,
    instagram_link,
    linkedin_link,
    image_link,
    professional_info_para_1,
    professional_info_para_2,
    post_of_staff,
  } = staffData || {};
  const max_length_limit_for_teacher_professional_info = 170;
  const max_length_limit_for_teacher_professional_info_para_1 = 200;
  const max_length_limit_for_teacher_professional_info_para_2 = 200;
  const [
    show_read_more_EDUCATIONAL__CONTENT,
    set_Show_read_more_EDUCATIONAL__CONTENT,
  ] = useState(true);
  const [
    show_read_more_PROFESSIONAL_CONTENT_PARA_1,
    set_Show_read_more_PROFESSIONAL_CONTENT_PARA_1,
  ] = useState(true);
  const [
    show_read_more_PROFESSIONAL_CONTENT_PARA_2,
    set_Show_read_more_PROFESSIONAL_CONTENT_PARA_2,
  ] = useState(true);

  return (
    <section className="team-details-section fix section-padding pb-0">
      <div className="container">
        <div className="team-details-wrapper">
          <div className="team-author-items ">
            <div className="thumb">
              <img src={image_link} alt="img" />
            </div>
            <div className="content">
              <h2>{name}</h2>
              <span>{post_of_staff}</span>
              <p>
                {show_read_more_EDUCATIONAL__CONTENT &&
                description_short_or_educational_info?.length >
                  max_length_limit_for_teacher_professional_info
                  ? description_short_or_educational_info.substring(
                      0,
                      max_length_limit_for_teacher_professional_info
                    ) + " ..."
                  : description_short_or_educational_info}
              </p>
              {description_short_or_educational_info?.length >
                max_length_limit_for_teacher_professional_info && (
                <div
                  className="read-more-wrapper-div mt-2"
                  data-aos-duration={400}
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  <a
                    // href="/about"
                    onClick={() => {
                      set_Show_read_more_EDUCATIONAL__CONTENT(
                        !show_read_more_EDUCATIONAL__CONTENT
                      );
                    }}
                    className="theme-btn"
                  >
                    Read {show_read_more_EDUCATIONAL__CONTENT ? "More" : "Less"}{" "}
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </a>
                </div>
              )}

              <ul>
                <li>Experience: 10 Years</li>
                <li>
                  <i className="fas fa-user"></i>
                  188 Students
                </li>
                <li>
                  <i className="fa-solid fa-star color-star"></i>
                  454 (36 Review)
                </li>
              </ul>
              <div className="social-icon d-flex align-items-center">
                <Link to={fb_link}>
                  <i className="fab fa-facebook-f"></i>
                </Link>
                <Link to={twitter_link}>
                  <i className="fab fa-twitter"></i>
                </Link>
                <Link to={linkedin_link}>
                  <i className="fa-brands fa-linkedin-in"></i>
                </Link>
                <Link to={youtube_link}>
                  <i className="fa-brands fa-youtube"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="details-info-items">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div className="info-content">
                  <h2>Professional Info</h2>
                  <p className="mb-3">
                    {show_read_more_PROFESSIONAL_CONTENT_PARA_1 &&
                    professional_info_para_1?.length >
                      max_length_limit_for_teacher_professional_info_para_1
                      ? professional_info_para_1.substring(
                          0,
                          max_length_limit_for_teacher_professional_info_para_1
                        ) + " ..."
                      : professional_info_para_1}
                  </p>
                  {professional_info_para_1?.length >
                    max_length_limit_for_teacher_professional_info_para_1 && (
                    <div
                      className="read-more-wrapper-div mt-2"
                      data-aos-duration={400}
                      data-aos="fade-up"
                      data-aos-delay="0"
                    >
                      <a
                        // href="/about"
                        onClick={() => {
                          set_Show_read_more_PROFESSIONAL_CONTENT_PARA_1(
                            !show_read_more_PROFESSIONAL_CONTENT_PARA_1
                          );
                        }}
                        className="theme-btn"
                      >
                        Read{" "}
                        {show_read_more_PROFESSIONAL_CONTENT_PARA_1
                          ? "More"
                          : "Less"}{" "}
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </a>
                    </div>
                  )}
                  <p className="mt-3">
                    {show_read_more_PROFESSIONAL_CONTENT_PARA_2 &&
                    professional_info_para_2?.length >
                      max_length_limit_for_teacher_professional_info_para_2
                      ? professional_info_para_2.substring(
                          0,
                          max_length_limit_for_teacher_professional_info_para_2
                        ) + " ..."
                      : professional_info_para_2}
                  </p>
                  {professional_info_para_2?.length >
                    max_length_limit_for_teacher_professional_info_para_2 && (
                    <div
                      className="read-more-wrapper-div mt-2"
                      data-aos-duration={400}
                      data-aos="fade-up"
                      data-aos-delay="0"
                    >
                      <a
                        // href="/about"
                        onClick={() => {
                          set_Show_read_more_PROFESSIONAL_CONTENT_PARA_2(
                            !show_read_more_PROFESSIONAL_CONTENT_PARA_2
                          );
                        }}
                        className="theme-btn"
                      >
                        Read{" "}
                        {show_read_more_PROFESSIONAL_CONTENT_PARA_2
                          ? "More"
                          : "Less"}{" "}
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="progress-area">
                  <div className="progress-wrap">
                    <div className="pro-items">
                      <div className="pro-head">
                        <h6 className="title">Creativity</h6>
                        <span className="point">90%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-value"></div>
                      </div>
                    </div>
                    <div className="pro-items">
                      <div className="pro-head">
                        <h6 className="title">Time Management</h6>
                        <span className="point">70%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-value style-two"></div>
                      </div>
                    </div>
                    <div className="pro-items">
                      <div className="pro-head">
                        <h6 className="title">Art and Carft</h6>
                        <span className="point">55%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-value style-three"></div>
                      </div>
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

export default TeacherDetailsBase;
