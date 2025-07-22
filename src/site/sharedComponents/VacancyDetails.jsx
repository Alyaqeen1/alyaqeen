import one from "../assets/img/event/event-details-1.jpg";
import two from "../assets/img/event/event-details-2.jpg";
import three from "../assets/img/event/event-details-3.jpg";
import four from "../assets/img/event/icon/01.svg";
import five from "../assets/img/event/icon/02.svg";
import six from "../assets/img/event/icon/03.svg";
import seven from "../assets/img/event/icon/04.svg";
import eight from "../assets/img/event/icon/05.svg";
import nine from "../assets/img/event/icon/06.svg";
import { Link, useParams } from "react-router";
import { useGetVacanciesQuery } from "../../redux/features/vacancies/vacanciesApi";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { GiClockwork } from "react-icons/gi";
import { FaRegEnvelope } from "react-icons/fa";

const VacancyDetails = () => {
  const { id } = useParams();
  const {
    data: vacancies,
    isLoading,
    isError,
    refetch,
  } = useGetVacanciesQuery();

  useEffect(() => {
    refetch(); // Force refetch when component mounts
  }, [refetch]);
  const singleVacancy = vacancies?.data?.find(
    (vacancy) => vacancy?.id === parseInt(id)
  );

  const {
    application_closing_date,
    desired_qualification,
    job_title,
    job_type,
    required_qualification,
    role_responsibilities,
    salary,
    created_at,
  } = singleVacancy || {};
  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <section className="program-details-section fix section-padding">
      <div className="container">
        <div className="program-details-wrapper">
          <div className="row g-5">
            <div className="col-lg-8 mt-0">
              <div className="program-details-items">
                {/* <div className="details-image">
                  <img src={one} alt="img" />
                </div> */}
                <div className="details-content">
                  <div className="d-flex justify-content-between">
                    <h2 className="mb-0">{job_title}</h2>
                    <div className="post">
                      <span>{job_type}</span>
                    </div>
                  </div>
                  <div className="details-author-area">
                    <ul className="class-list">
                      <li>
                        <LiaMoneyBillWaveSolid
                          style={{
                            color: "var(--theme)",
                            fontSize: "1.5rem",
                            marginRight: "0.5rem",
                          }}
                        />
                        Salary: {salary}
                      </li>
                      <li>
                        <GiClockwork
                          style={{
                            color: "var(--theme)",
                            fontSize: "1.5rem",
                            marginRight: "0.5rem",
                          }}
                        />{" "}
                        Application Deadline: {application_closing_date}
                      </li>
                    </ul>
                  </div>
                  <h2>Required Qualification</h2>
                  <ul className="list-items mb-5">
                    {required_qualification
                      ?.split(". ")
                      .map((qualification) => (
                        <li>
                          <i className="fa-solid fa-check"></i>
                          {qualification}
                        </li>
                      ))}
                  </ul>
                  <h2>Desired Qualification</h2>

                  <ul className="list-items mb-5">
                    {desired_qualification?.split(". ").map((qualification) => (
                      <li>
                        <i className="fa-solid fa-check"></i>
                        {qualification}
                      </li>
                    ))}
                  </ul>
                  <h2>Role Responsibilities</h2>

                  <ul className="list-items mb-2">
                    {role_responsibilities?.split(". ").map((qualification) => (
                      <li>
                        <i className="fa-solid fa-check"></i>
                        {qualification}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="details-list-area">
                <h3>Event Information:</h3>
                <ul className="details-list">
                  <li>
                    <span>
                      <img src={four} alt="img" className="me-2" />
                      Creation Date:
                    </span>
                    {new Date(created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </li>
                  <li>
                    <span>
                      <img src={five} alt="img" className="me-2" />
                      Deadline:
                    </span>
                    {application_closing_date}
                  </li>
                  <li className="flex">
                    <span className="flex">
                      <img src={six} alt="img" className="me-2" />
                      Location:
                    </span>
                    116 Church Road, Yardley,
                    <br /> Birmingham, B25 8UX
                  </li>
                  <li>
                    <span>
                      <img src={seven} alt="img" className="me-2" />
                      Phone:
                    </span>
                    +07869636849
                  </li>
                  <li>
                    <span>
                      {/* <FaRegEnvelope
                        style={{
                          color: "var(--theme)",
                          marginRight: "0.5rem",
                        }}
                      /> */}
                      <img src={eight} alt="img" className="me-2" />
                      Email:
                    </span>
                    contact@alyaqeen.co.uk
                  </li>
                  <li>
                    <span>
                      <img src={nine} alt="img" className="me-2" />
                      Language
                    </span>
                    English
                  </li>
                </ul>

                <div className="social-icon d-flex align-items-center">
                  <span>Share: </span>
                  <Link to="https://www.facebook.com/AlyaqeenAcademy">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link to="/">
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link to="/">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </Link>
                  <Link to="https://www.youtube.com/@alyaqeenacademy5282">
                    <i className="fa-brands fa-youtube"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VacancyDetails;
