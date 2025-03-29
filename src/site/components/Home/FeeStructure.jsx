import React from "react";
import { Link } from "react-router";

const FeeStructure = () => {
  return (
    <section
      className="program-section-feb-24 section-padding section-bg-2 fix"
      id="programs"
    >
      <div className="top-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/section-top-shape.png"
          className=""
          alt="shape-img"
        />
      </div>

      <div className="mask-shape float-bob-x">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="pencil-shape">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/pencil.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="mask-shape-2 text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/mask-2.png"
          className="w-50"
          alt="shape-img"
        />
      </div>

      <div className="compass-shape text-end">
        <img
          src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/compass.png"
          className="w-50"
          alt="shape-img"
        />
      </div>
      <div className="container">
        <div className="section-title text-center mt-60">
          <span data-aos-duration="800" data-aos="fade-up">
            {/*Our Programs*/}Classes &amp; Fee Structure
          </span>
          <h2 data-aos-duration="800" data-aos="fade-up" data-aos-delay="300">
            {/*We meet kids at their level*/}Alyaqeen Academy <br /> Classes
            &amp; Fee Structure
          </h2>
        </div>
        <div className="row table-responsive">
          <table
            className="table mb-3"
            // style="min-width:700px;"

            style={{
              minWidth: 700,
            }}
          >
            <thead>
              <tr>
                <td
                  width="30%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"

                  className={`text-white font-weight-bold border h6 text-center align-middle`}
                  style={{
                    backgroundColor: "var(--theme)",
                  }}

                  // className={`text-white $var(--theme) font-weight-bold border h6 text-center align-middle`}
                >
                  <h3>Subject</h3>
                </td>
                <td
                  width="35%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"
                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{
                    backgroundColor: "var(--theme)",
                  }}
                >
                  <h3>Weekdays Classes</h3>
                </td>
                <td
                  width="35%"
                  // className="text-white bg-success font-weight-bold border h6 text-center align-middle"

                  className="text-white font-weight-bold border h6 text-center align-middle"
                  style={{
                    backgroundColor: "var(--theme)",
                  }}
                >
                  <h3>Weekends Classes</h3>
                </td>
              </tr>
            </thead>

            {/* first row data */}
            <tbody>
              <tr>
                <td className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle">
                  <Link to={"/arabic-qaidah-quran-hifdh"}>
                    <h5>Arabic Qaidah, Quran &amp; Islamic Studies</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      £1.85<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      £50<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Mon - Thu
                    <br />
                    4:30 - 6:00pm / 5:45 - 7:15pm
                  </strong>
                </td>

                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    {/* <h6 class="mb-0 w-100 border-right"><small>/</small></h6> */}
                    <div className="mb-0 w-100 border-left">
                      £1.70<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-left">
                      £50<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Sat - Sun
                    <br />
                    10am - 12:30pm/12:30 - 2:30pm
                  </strong>
                </td>
              </tr>

              {/* 2nd row data  */}
              <tr>
                <td
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                  // className="p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/maths-english-science"}
                    // className="text-danger font-14"
                    className="font-14"
                  >
                    <h5>Primary Maths &amp; English Tuition</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      £5<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      £100<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Mon - Tue
                    <br />5 - 7pm
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      £4.44<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      £80<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Sat - Sun
                    <br />
                    10am - 12pm
                  </strong>
                </td>
              </tr>

              {/* 3rd row data */}
              <tr>
                <td
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                  // className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/maths-english-science"}
                    // to="https://alyaqeen.co.uk/maths-english-and-science-tuition-primary"
                    // className="text-danger font-14"

                    className="font-14"
                  >
                    <h5>GCSE Maths English &amp; Science Tuition</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      £6.25<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      £120<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Wed - Thu
                    <br />5 - 7pm
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      £5<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      £100<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Sat - Sun
                    <br />
                    10am - 12pm / 10am - 1pm
                  </strong>
                </td>
              </tr>

              {/* 4th row data  */}
              <tr>
                <td
                  // className="text-white p-1 bg-brown font-weight-light border h6 text-center align-middle"
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/arabic-qaidah-quran-hifdh"}
                    // to="https://alyaqeen.co.uk/arabic-qaidah-quran-hifdh"
                    className="font-14"
                    // // className="text-danger font-14"
                  >
                    <h5>In Centre one to one </h5>
                    <div className="font-weight-bold mb-0">
                      <h5>Qaidah/Quran tuition</h5>
                    </div>
                    <h5>for adult males &amp; females</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      £10<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      £80<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Mon - Thu or Wed - Thu
                    <br />
                    7:00 - 8:00pm
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      £12.50<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      £100<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Sat - Sun
                    <br />8 - 9am/9 - 10am
                  </strong>
                </td>
              </tr>

              {/* 5th row data */}
              <tr>
                <td
                  // className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"

                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/arabic-qaidah-quran-hifdh"}
                    // to="https://alyaqeen.co.uk/arabic-qaidah-quran-hifdh"
                    className="font-14"
                    // className="text-danger font-14"
                  >
                    <h5>Hifz Memorisation</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      £1.85<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      £90<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Mon-Thu
                    <br />
                    4:30 - 7:00pm/5 - 7pm
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      £2<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      £60<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Sat - Sun
                    <br />
                    10am - 1pm/12 - 2:30pm
                  </strong>
                </td>
              </tr>

              {/* 6th row data  */}
              <tr>
                <td
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                  // className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/arabic-language"}
                    // to="https://alyaqeen.co.uk/arabic-language"
                    className="font-14"
                    // className="text-danger font-14"
                  >
                    <h5>Arabic Language</h5>
                  </Link>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      £1.66<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      £60<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Mon-Thu
                    <br />6 - 7pm
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      £10<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      £40<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Sat - Sun
                    <br />9 - 10am
                  </strong>
                </td>
              </tr>

              {/* 7th row data */}
              <tr>
                <td
                  className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                  // className="text-white p-1 bg-brown font-weight-bold border h6 text-center align-middle"
                >
                  <Link
                    to={"/modern-foreign-languages"}
                    // to="https://alyaqeen.co.uk/arabic-language"
                    className="font-14"
                    // className="text-danger font-14"
                  >
                    <h5>Urdu/Bangla Languages</h5>
                  </Link>
                </td>
                <td className="text-center p-1  border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-right fw-light">
                      £3.66<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-right fw-light">
                      £40<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Mon-Thu
                    <br />6 - 7pm
                  </strong>
                </td>
                <td className="text-center p-1 border mb-0">
                  <div className="d-flex justify-content-around">
                    <div className="mb-0 w-100 border-left fw-light">
                      £2.50<small>/hour</small>
                    </div>
                    <div className="mb-0 w-100 border-left fw-light">
                      £50<small>/month</small>
                    </div>
                  </div>
                  <strong>
                    Sat - Sun
                    <br />
                    11am - 1pm
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    /* </div>
     </div>
 </section>*/
  );
};

export default FeeStructure;
