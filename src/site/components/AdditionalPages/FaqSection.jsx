import { useState } from "react";

const FaqSection = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  const [imgTab, setImgTab] = useState(0);

  return (
    <section className="faq-section fix section-padding">
      <div className="container">
        <div className="faq-wrapper">
          <div className="row g-4">
            <div className="col-lg-3">
              <div className="faq-left">
                <ul className="nav" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 0 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(0)}
                    >
                      Admission / Registration
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 1 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(1)}
                    >
                      FEES / FINANCIAL
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 2 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(2)}
                    >
                      ABSENT
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className={`nav-link ${
                        activeTabIndex === 3 ? " active" : ""
                      }`}
                      onClick={() => handleTabClick(3)}
                    >
                      MISCELLANEOUS
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="tab-content">
                <div
                  id="trust"
                  className={`c-tab-single ${
                    activeTabIndex === 0 ? "active-tab" : ""
                  }`}
                  role="tabpanel"
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 0 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 0 ? -1 : 0)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq1"
                              aria-expanded="true"
                              aria-controls="faq1"
                            >
                              How to enroll my child at Alyaqeen Academy?
                            </button>
                          </h5>
                          <div
                            id="faq1"
                            className={`accordion-collapse collapse${
                              imgTab === 0 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              <p className="mb-3">
                                If you would like to enrol your child at
                                Alyaqeen Academy it's easy and simple. Please
                                click on the link to direct you to the
                                registration page Or Simply Download the
                                registration form from the website.
                                www.alyaqeen.co.uk
                              </p>
                              <p>
                                Please contact the Academy on either telephone
                                or email. You are also welcome to walk in and a
                                member of staff will see to your query.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 2 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 2 ? -1 : 2)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq2"
                              aria-expanded="false"
                              aria-controls="faq2"
                            >
                              Is there an admission fee?
                            </button>
                          </h5>
                          <div
                            id="faq2"
                            className={`accordion-collapse collapse${
                              imgTab === 2 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Yes, there will be a fee of £20.00 for admission.
                              Only once for registration
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 3 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 3 ? -1 : 3)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq3"
                              aria-expanded="false"
                              aria-controls="faq3"
                            >
                              What syllabus is taught at the Alyaqeen Academy?
                            </button>
                          </h5>
                          <div
                            id="faq3"
                            className={`accordion-collapse collapse${
                              imgTab === 3 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              <p className="mb-3">
                                For Arabic Qaidah and Quran student’s are taught
                                from the Basic Arabic Book (Qaidah) and the Holy
                                Quran where the child will complete 13 Levels,
                                plus 7 Levels of Tajweed Book. Then the child
                                will start the Holy Quran InshaAllah. We Teach
                                the basic book in Arabic and English only.
                              </p>
                              <p className="mb-3">
                                For Islamic studies and Duas Surah, student’s
                                are taught from the Safar Series Islamic Study
                                books.
                              </p>
                              <p>
                                For the School Tuition KS1, KS2, KS3 and KS4
                                (GCSE), students are taught what is required by
                                UK’s National Curriculum.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="general"
                  className={`c-tab-single ${
                    activeTabIndex === 1 ? "active-tab" : ""
                  }`}
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion2">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 8 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 8 ? -1 : 8)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq22"
                              aria-expanded="false"
                              aria-controls="faq22"
                            >
                              What are the fees?
                            </button>
                          </h5>
                          <div
                            id="faq22"
                            className={`accordion-collapse collapse${
                              imgTab === 8 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              <p className="mb-3">
                                We charge £50 per child per month for
                                Arabic,Qaida,Quran and islamic Studies.
                              </p>
                              <p>
                                For Maths English or Science are different, Also
                                if there are more than 3 children then we give
                                some discount.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 7 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 7 ? -1 : 7)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq11"
                              aria-expanded="true"
                              aria-controls="faq11"
                            >
                              Can I get a discount if I have more children
                              registering or attending Academy?
                            </button>
                          </h5>
                          <div
                            id="faq11"
                            className={`accordion-collapse collapse${
                              imgTab === 7 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Yes, if more than three children will attend, up
                              to three children No, sorry we are unable to give
                              a further discount than has already been offered.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 9 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 9 ? -1 : 9)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq33"
                              aria-expanded="false"
                              aria-controls="faq33"
                            >
                              Do we have to pay holiday fees?
                            </button>
                          </h5>
                          <div
                            id="faq33"
                            className={`accordion-collapse collapse${
                              imgTab === 9 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              <p className="mb-3">
                                Yearly fees are £600, so we divided £600 by 12
                                months to make it easy for you.
                              </p>
                              <p>
                                This means that even if there are holidays you
                                will still be paying £50 a month for each child.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 10 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 10 ? -1 : 10)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq44"
                              aria-expanded="false"
                              aria-controls="faq44"
                            >
                              If my child will be absent due to holiday or
                              illness, do I still have to pay fees?
                            </button>
                          </h5>
                          <div
                            id="faq44"
                            className={`accordion-collapse collapse${
                              imgTab === 10 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              <p className="mb-3">
                                Yes, absence from the Academy for ANY reason,
                                requires continuing payments to secure your
                                child’s place.
                              </p>
                              <p>
                                We reserve the right to remove your child to
                                offer the place to another on the waiting list.
                                Alternatively, you may remove your child to
                                avoid further payments during absence, however,
                                places are not guaranteed. You will need to
                                re-apply and pay to re-register and join the
                                waiting list until a place becomes available.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 11 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 11 ? -1 : 11)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq55"
                              aria-expanded="false"
                              aria-controls="faq55"
                            >
                              When are fees due?
                            </button>
                          </h5>
                          <div
                            id="faq55"
                            className={`accordion-collapse collapse${
                              imgTab === 11 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Fees are due by the first week of every month, the
                              parents should pay between 1 to 7 dates of each
                              month.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item  mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 12 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 12 ? -1 : 12)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq66"
                              aria-expanded="false"
                              aria-controls="faq66"
                            >
                              “I am struggling to pay my child’s fee, is there
                              any assistance”?
                            </button>
                          </h5>
                          <div
                            id="faq66"
                            className={`accordion-collapse collapse${
                              imgTab === 12 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              If you are struggling to pay your child’s fee
                              please contact the Academy to discuss this matter
                              in confidentiality.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 13 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 13 ? -1 : 13)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq66"
                              aria-expanded="false"
                              aria-controls="faq66"
                            >
                              What happens if I missed a payment?
                            </button>
                          </h5>
                          <div
                            id="faq66"
                            className={`accordion-collapse collapse${
                              imgTab === 13 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              If a payment is missed you will receive a text
                              from the Academy to remind you of the outstanding
                              payment. Should payment thereafter not be made,
                              you will receive a formal notice that payment is
                              due and needs to be paid within 7 working days. If
                              payment is not made within 7 working days then the
                              fees should be paid with the next month payment in
                              advance.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="programs"
                  className={`c-tab-single ${
                    activeTabIndex === 2 ? "active-tab" : ""
                  }`}
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion3">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 13 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 13 ? -1 : 13)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq111"
                              aria-expanded="true"
                              aria-controls="faq111"
                            >
                              How do I inform the academy if my child is not
                              able to attend?
                            </button>
                          </h5>
                          <div
                            id="faq111"
                            className={`accordion-collapse collapse${
                              imgTab === 13 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              If your child is not able to attend due to
                              sickness or any other unexpected reason then we
                              request that you either text,phone or email the
                              academy in order to inform the office. Otherwise
                              the child will be unauthorised absent and for more
                              than 2 weeks unauthorised absence the child
                              registration will be cancelled.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 14 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 14 ? -1 : 14)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq222"
                              aria-expanded="false"
                              aria-controls="faq222"
                            >
                              Will my child lose their place at the academy if
                              their was to go abroad?
                            </button>
                          </h5>
                          <div
                            id="faq222"
                            className={`accordion-collapse collapse${
                              imgTab === 14 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              <p className="mb-3">
                                We require parents/guardians to inform the
                                academy if your child is going abroad.
                              </p>
                              <p>
                                You will appreciate that although we do not ask
                                for a specific number of days notice prior to
                                travelling, should a child not attend the
                                academy for more than 2 weeks without informing
                                the academy as to the reason for their absence,
                                then your child’s place will be withdrawn
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="kindergarten"
                  className={`c-tab-single ${
                    activeTabIndex === 3 ? "active-tab" : ""
                  }`}
                >
                  <div className="faq-content">
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion4">
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 19 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 19 ? -1 : 19)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq1111"
                              aria-expanded="true"
                              aria-controls="faq1111"
                            >
                              What is the age limit to study at the Academy?
                            </button>
                          </h5>
                          <div
                            id="faq1111"
                            className={`accordion-collapse collapse${
                              imgTab === 19 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Alyaqeen Academy caters for both male and female
                              students aged 5 – 18. There is also separate
                              settings for adult: male and females who wish to
                              study at the academy.`
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 20 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 20 ? -1 : 20)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq2222"
                              aria-expanded="false"
                              aria-controls="faq2222"
                            >
                              Do you have male and female teachers?
                            </button>
                          </h5>
                          <div
                            id="faq2222"
                            className={`accordion-collapse collapse${
                              imgTab === 20 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Yes, at Alyaqeen academy we have both male and
                              female teachers.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 21 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 21 ? -1 : 21)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq3333"
                              aria-expanded="false"
                              aria-controls="faq3333"
                            >
                              Is there separate seating arrangements for boys
                              and girls?
                            </button>
                          </h5>
                          <div
                            id="faq3333"
                            className={`accordion-collapse collapse${
                              imgTab === 21 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              usually the the girls classes take place upstairs
                              and the boys classes take place downstairs If you
                              require separate seating arrangement for your
                              child, then this can be catered for subject to
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 22 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 22 ? -1 : 22)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq4444"
                              aria-expanded="false"
                              aria-controls="faq4444"
                            >
                              Is food available during break times?
                            </button>
                          </h5>
                          <div
                            id="faq4444"
                            className={`accordion-collapse collapse${
                              imgTab === 22 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Students are allowed to eat during break times,
                              however food to purchase is not available at the
                              academy and therefore any food will need to be
                              brought before coming to the academy.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 23 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 23 ? -1 : 23)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq5555"
                              aria-expanded="false"
                              aria-controls="faq5555"
                            >
                              Can I purchase books and stationary from the main
                              office?
                            </button>
                          </h5>
                          <div
                            id="faq5555"
                            className={`accordion-collapse collapse${
                              imgTab === 23 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Yes, books and stationary are available to
                              purchase at the main office.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item  mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 24 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 0 ? -1 : 24)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq6666"
                              aria-expanded="false"
                              aria-controls="faq6666"
                            >
                              What is the age group for the Football club and
                              Cricket club?
                            </button>
                          </h5>
                          <div
                            id="faq6666"
                            className={`accordion-collapse collapse${
                              imgTab === 24 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              Students over the age of 10 are allowed to join
                              the Football/Cricket club provided parental
                              consent is given.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h5 className="accordion-header">
                            <button
                              className={
                                (imgTab == 25 ? "  " : " collapsed") +
                                " accordion-button"
                              }
                              onClick={() => setImgTab(imgTab === 0 ? -1 : 25)}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#faq7777"
                              aria-expanded="false"
                              aria-controls="faq7777"
                            >
                              Is there any fee for joining the Football or
                              Cricket club?
                            </button>
                          </h5>
                          <div
                            id="faq7777"
                            className={`accordion-collapse collapse${
                              imgTab === 25 ? " show " : ""
                            }`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              No, there is no fee for playing Football or
                              Cricket, only £15 if the child will need to
                              participate in the summer tournament matches.
                            </div>
                          </div>
                        </div>
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

export default FaqSection;
