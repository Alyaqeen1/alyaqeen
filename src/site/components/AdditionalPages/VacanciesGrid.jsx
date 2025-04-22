import { Link } from "react-router";
import { useGetVacanciesQuery } from "../../../redux/features/vacancies/vacanciesApi";
import LoadingSpinner from "../LoadingSpinner";
import { PiMoneyWavy } from "react-icons/pi";

const VacanciesGrid = () => {
  const { data: vacancies, isLoading, isError } = useGetVacanciesQuery();
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (isError) {
    return <h2 className="text-center my-4">Error loading news</h2>;
  }
  return (
    <section className="news-section-3 fix section-padding">
      <div className="container">
        <div className="row g-4">
          {vacancies?.data?.length > 0 ? (
            vacancies?.data?.map((vacancy) => (
              <div
                key={vacancy?.id}
                className="col-xl-4 col-lg-6 col-md-6 d-flex"
                data-aos-duration="800"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="news-card-items mt-0 d-flex flex-column w-100">
                  <div className="news-image">
                    {/* <img
                      src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/04.jpg"
                      alt="img"
                    /> */}
                    {/* <div className="news-layer-wrapper">
                      <div
                        className="news-layer-image"
                        style={{
                          backgroundImage:
                            "url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/04.jpg)",
                        }}
                      ></div>
                      <div
                        className="news-layer-image"
                        style={{
                          backgroundImage:
                            "url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/04.jpg)",
                        }}
                      ></div>
                      <div
                        className="news-layer-image"
                        style={{
                          backgroundImage:
                            "url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/04.jpg)",
                        }}
                      ></div>
                      <div
                        className="news-layer-image"
                        style={{
                          backgroundImage:
                            "url(https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/news/04.jpg)",
                        }}
                      ></div>
                    </div> */}
                    <div className="post">
                      <span>Activities</span>
                    </div>
                  </div>
                  <div className="news-content">
                    <ul>
                      <li>
                        <i className="fas fa-calendar-alt"></i>
                        {new Date(vacancy?.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </li>
                      <li>
                        <i className="far fa-user"></i>
                        By admin
                      </li>
                    </ul>
                    <h3>
                      <Link to={`/vacancy-details/${vacancy?.id}`}>
                        {vacancy?.job_title}
                      </Link>
                    </h3>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="">
                        <PiMoneyWavy /> £{vacancy?.salary}
                      </h6>
                      <div
                        style={{
                          backgroundColor: "var(--theme)",
                          width: "fit-content",
                        }}
                        className="post rounded-3 py-1 px-2 text-white"
                      >
                        <span>{vacancy?.job_type}</span>
                      </div>
                    </div>
                    <Link
                      to={`/vacancy-details/${vacancy?.id}`}
                      className="theme-btn-2 mt-3 d-flex align-items-center"
                    >
                      Read More <i className="fas fa-long-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <h2 className="text-center my-4">No Vacancies Available</h2>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VacanciesGrid;
