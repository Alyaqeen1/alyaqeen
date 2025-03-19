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
                <span className="text-slider">2024 Social Media</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} className="" alt="img" />
                </span>
                <span className="text-slider text-color">Most Impact</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider">Award Wining</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">2023 Maths </span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider">2024 Social Media</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">Most Impact</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider">Award Wining</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">2023 Maths </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
