import { useEffect, useState } from "react";
import SyllabusModal from "./SyllabusModal";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import SubjectPlan from "./SubjectPlan";
import TextbookPlan from "./TextbookPlan";

const SyllabusPlan = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [aqidahData, setAqidahData] = useState([]);
  const [fiqhData, setFiqhData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [personalDevData, setPersonalDevData] = useState([]);
  const [sirahData, setSirahData] = useState([]);
  const [textbook1Data, setTextbook1Data] = useState([]);
  const [textbook2Data, setTextbook2Data] = useState([]);
  const [textbook3Data, setTextbook3Data] = useState([]);
  const [textbook4Data, setTextbook4Data] = useState([]);
  const [textbook5Data, setTextbook5Data] = useState([]);
  const [textbook6Data, setTextbook6Data] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const handleSyllabusData = async () => {
      const { data } = await axios.get("/syllabus.json");
      if (data) {
        setLocalLoading(false);
      }
      const aqidahData = data.filter(
        (single) => single.title === "aqidah" && single.category === "subject"
      );
      const fiqhData = data.filter(
        (single) => single.title === "fiqh" && single.category === "subject"
      );
      const historyData = data.filter(
        (single) => single.title === "history" && single.category === "subject"
      );
      const personalDevData = data.filter(
        (single) =>
          single.title === "personal development" &&
          single.category === "subject"
      );
      const sirahData = data.filter(
        (single) => single.title === "sirah" && single.category === "subject"
      );
      const textbook1Data = data.filter(
        (single) =>
          single.title === "textbook 1" && single.category === "textbook"
      );
      const textbook2Data = data.filter(
        (single) =>
          single.title === "textbook 2" && single.category === "textbook"
      );
      const textbook3Data = data.filter(
        (single) =>
          single.title === "textbook 3" && single.category === "textbook"
      );
      const textbook4Data = data.filter(
        (single) =>
          single.title === "textbook 4" && single.category === "textbook"
      );
      const textbook5Data = data.filter(
        (single) =>
          single.title === "textbook 5" && single.category === "textbook"
      );
      const textbook6Data = data.filter(
        (single) =>
          single.title === "textbook 6" && single.category === "textbook"
      );

      setAqidahData(aqidahData);
      setFiqhData(fiqhData);
      setHistoryData(historyData);
      setPersonalDevData(personalDevData);
      setSirahData(sirahData);
      setTextbook1Data(textbook1Data);
      setTextbook2Data(textbook2Data);
      setTextbook3Data(textbook3Data);
      setTextbook4Data(textbook4Data);
      setTextbook5Data(textbook5Data);
      setTextbook6Data(textbook6Data);
    };
    handleSyllabusData();
  }, []);

  // Toggle modal visibility
  const handleShow = (selectedCategory) => {
    setShowModal(true);
    setSelectedCategory(selectedCategory);
  };
  const handleClose = () => setShowModal(false);

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };
  if (localLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <section className="pricing-section section-padding mt-0">
      <div className="container">
        <div className="pricing-wrapper">
          <div className="section-title text-center mb-0">
            <span data-aos-duration="800" data-aos="fade-up">
              Our Syllabus
            </span>
            <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
              Explore the syllabus <br /> and achieve learning goals
            </h2>
          </div>
          <ul className="nav" role="tablist">
            <li
              className="nav-item "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="300"
              role="presentation"
            >
              <a
                className={`nav-link text-uppercase box-shadow ${
                  activeTabIndex === 0 ? " active" : ""
                }`}
                onClick={() => handleTabClick(0)}
              >
                By Subject
              </a>
            </li>
            <li
              className="nav-item "
              data-aos-duration="800"
              data-aos="fade-up"
              data-aos-delay="500"
              role="presentation"
            >
              <a
                className={`nav-link text-uppercase box-shadow ${
                  activeTabIndex === 1 ? " active" : ""
                }`}
                onClick={() => handleTabClick(1)}
              >
                By Textbook
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div
            id="subject"
            className={`c-tab-single ${
              activeTabIndex === 0 ? "active-tab" : ""
            }`}
          >
            <SubjectPlan
              aqidahData={aqidahData}
              fiqhData={fiqhData}
              historyData={historyData}
              personalDevData={personalDevData}
              sirahData={sirahData}
              handleShow={handleShow}
            ></SubjectPlan>
          </div>
          <div
            id="textbook"
            className={`c-tab-single ${
              activeTabIndex === 1 ? "active-tab" : ""
            }`}
          >
            <TextbookPlan
              textbook1Data={textbook1Data}
              textbook2Data={textbook2Data}
              textbook3Data={textbook3Data}
              textbook4Data={textbook4Data}
              textbook5Data={textbook5Data}
              textbook6Data={textbook6Data}
              handleShow={handleShow}
            ></TextbookPlan>
          </div>
        </div>
      </div>
      <SyllabusModal
        selectedCategory={selectedCategory}
        selectedData={
          selectedCategory === "aqidah"
            ? aqidahData
            : selectedCategory === "fiqh"
            ? fiqhData
            : selectedCategory === "history"
            ? historyData
            : selectedCategory === "personal development"
            ? personalDevData
            : selectedCategory === "sirah"
            ? sirahData
            : selectedCategory === "textbook 1"
            ? textbook1Data
            : selectedCategory === "textbook 2"
            ? textbook2Data
            : selectedCategory === "textbook 3"
            ? textbook3Data
            : selectedCategory === "textbook 4"
            ? textbook4Data
            : selectedCategory === "textbook 5"
            ? textbook5Data
            : selectedCategory === "textbook 6"
            ? textbook6Data
            : []
        }
        handleClose={handleClose}
        showModal={showModal}
      ></SyllabusModal>
    </section>
  );
};

export default SyllabusPlan;
