import one from "../../assets/img/event/01.jpg";
import two from "../../assets/img/event/02.jpg";
import three from "../../assets/img/event/03.jpg";
import four from "../../assets/img/line-1.png";
import five from "../../assets/img/line-2.png";
import six from "../../assets/img/complaint.png";
import seven from "../../assets/img/circle-2.png";
import shape from "../../assets/img/event/shape.png";
import calendar from "../../assets/img/event/calender.svg";
import background from "../../assets/img/event-bg.jpg";
import { Link } from "react-router";
import { useAddComplaintMutation } from "../../../redux/features/complaint/complaintApi";
import toast from "react-hot-toast";

const ComplaintComp = () => {
  const [addComplaint, { data, isSuccess, isLoading }] =
    useAddComplaintMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const incident_date = form.incident_date.value;
    const title = form.title.value;
    const description = form.description.value;
    const madrasha_id = 2;
    const complaintData = {
      name,
      email,
      phone,
      incident_date,
      title,
      description,
      madrasha_id,
    };

    addComplaint(complaintData);
    toast.success("Complaint submitted successfully");
    form.reset();
  };

  return (
    <section
      className="event-section bg-cover"
      id="event"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="event-top-shape">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="container">
        <div className="contact-section">
          <div className="line-1">
            <img src={four} alt="shape-img" />
          </div>
          <div className="line-2">
            <img src={five} alt="shape-img" />
          </div>
          <div className="">
            <div className="contact-wrapper">
              <div
                className="row align-items-center"
                style={{ minHeight: "100vh" }}
              >
                <div className="col-lg-6">
                  <div
                    className="contact-image "
                    data-aos-duration="800"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    <img src={six} alt="contact-img" />
                    <div className="cricle-shape">
                      <img src={seven} alt="shape-img" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="contact-content">
                    <div className="section-title">
                      <span
                        className="text-white"
                        data-aos-duration="800"
                        data-aos="fade-up"
                      >
                        We’re Here to Listen
                      </span>
                      <h3
                        className="text-white fs-1"
                        data-aos-duration="800"
                        data-aos="fade-up"
                        data-aos-delay="300"
                      >
                        Share Your Complaint or Concern
                      </h3>
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      //   action="#"
                      id="contact-form"
                      //   method="POST"
                      className="contact-form-items"
                    >
                      <div className="row g-4">
                        <div
                          className="col-lg-6 "
                          data-aos-duration="800"
                          data-aos="fade-up"
                          data-aos-delay="300"
                        >
                          <div className="form-clt">
                            <span>Your name*</span>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your Name"
                              required
                            />
                          </div>
                        </div>
                        <div
                          className="col-lg-6 "
                          data-aos-duration="800"
                          data-aos="fade-up"
                          data-aos-delay="500"
                        >
                          <div className="form-clt">
                            <span>Your Email*</span>
                            <input
                              type="text"
                              name="email"
                              id="email"
                              required
                              placeholder="Your Email"
                            />
                          </div>
                        </div>
                        <div
                          className="col-lg-6"
                          data-aos-duration="800"
                          data-aos="fade-up"
                          data-aos-delay="700"
                        >
                          <div className="form-clt">
                            <span>Your Phone Number*</span>
                            <input
                              type="number"
                              name="phone"
                              id="phone"
                              required
                              placeholder="Your Phone Number"
                            />
                          </div>
                        </div>
                        <div
                          className="col-lg-6"
                          data-aos-duration="800"
                          data-aos="fade-up"
                          data-aos-delay="900"
                        >
                          <div className="form-clt">
                            <span>Incident Date*</span>
                            <input
                              type="date"
                              name="incident_date"
                              id="date"
                              required
                              placeholder="Incident Date"
                            />
                          </div>
                        </div>
                        <div
                          className="col-lg-12"
                          data-aos-duration="800"
                          data-aos="fade-up"
                          data-aos-delay="1000"
                        >
                          <div className="form-clt">
                            <span>Complaint Subject*</span>
                            <input
                              type="text"
                              name="title"
                              id="subject"
                              required
                              placeholder="Briefly describe your complaint"
                            />
                          </div>
                        </div>

                        <div
                          className="col-lg-12"
                          data-aos-duration="800"
                          data-aos="fade-up"
                          data-aos-delay="1100"
                        >
                          <div className="form-clt">
                            <span>Complaint Details*</span>
                            <textarea
                              name="description"
                              id="message"
                              required
                              placeholder="Please describe your issue or complaint in detail"
                            ></textarea>
                          </div>
                        </div>

                        <div
                          className="col-lg-7 "
                          data-aos-duration="800"
                          data-aos="fade-up"
                          data-aos-delay="500"
                        >
                          <button
                            disabled={isLoading}
                            type="submit"
                            className="theme-btn bg-white"
                          >
                            {isLoading ? "Sending" : "Send Request"}
                            <i className="fa-solid fa-arrow-right-long"></i>
                          </button>
                        </div>
                      </div>
                    </form>
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

export default ComplaintComp;
