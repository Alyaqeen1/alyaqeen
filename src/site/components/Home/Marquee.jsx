import { useTranslation } from "react-i18next";
import one from "../../assets/img/asterisk.svg";

const Marquee = () => {
  const { t } = useTranslation(["home"]);
  const { highlightAchievement, certificateRecognition, examAnnouncement } =
    t("marquee") || {};
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
                <span className="text-slider">{highlightAchievement}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} className="" alt="img" />
                </span>
                <span className="text-slider text-color">
                  {certificateRecognition}
                </span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider">{examAnnouncement}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">
                  {highlightAchievement}
                </span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider">{certificateRecognition}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
                <span className="text-slider text-color">
                  {examAnnouncement}
                </span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img src={one} alt="img" />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
