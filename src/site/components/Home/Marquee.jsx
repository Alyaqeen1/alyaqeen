import one from "../../assets/img/asterisk.svg";

const Marquee = () => {
  return (
    <div className="marque-section section-padding pt-0">
      <div className="container-fluid">
        <div className="marquee-wrapper text-slider">
          <div className="marquee-inner to-left">
            <ul className="marqee-list">
              <li className="marquee-item d-flex">
                <div className="text-slider w-[50px] flex justify-center items-center">
                  <img className="w-full" src={one} alt="img" />
                </div>
                <span className="text-slider">Award-winning</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} className="" alt="img" />
                </span>
                <span className="text-slider text-color">
                  nominated certificates
                </span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider">Mid Term Exam 2025</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">Award-winning</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider">nominated certificates</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">
                  Mid Term Exam 2025
                </span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                {/* <span className="text-slider">Award Wining</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">2023 Maths </span> */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
