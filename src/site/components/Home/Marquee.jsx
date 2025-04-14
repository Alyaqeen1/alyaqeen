import { useTranslation } from "react-i18next";

const Marquee = () => {
  const { t } = useTranslation(["home"]);
  const { text1, text2, text3 } = t("marquee") || {};
  return (
    <div className="marque-section section-padding pt-0">
      <div className="container-fluid">
        <div className="marquee-wrapper text-slider">
          <div className="marquee-inner to-left">
            <ul className="marqee-list">
              <li className="marquee-item d-flex">
                <div className="text-slider w-[50px] flex justify-center items-center">
                  <img
                    className="w-full"
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/asterisk.svg"
                    alt="img"
                  />
                </div>
                <span className="text-slider">{text1}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/asterisk.svg"
                    className=""
                    alt="img"
                  />
                </span>
                <span className="text-slider text-color">{text2}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/asterisk.svg"
                    alt="img"
                  />
                </span>
                <span className="text-slider">{text3}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/asterisk.svg"
                    alt="img"
                  />
                </span>
                <span className="text-slider text-color">{text1}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/asterisk.svg"
                    alt="img"
                  />
                </span>
                <span className="text-slider">{text2}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/asterisk.svg"
                    alt="img"
                  />
                </span>
                <span className="text-slider text-color">{text3}</span>
                <span className="text-slider w-[50px] flex justify-center items-center">
                  <img
                    src="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/asterisk.svg"
                    alt="img"
                  />
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
