import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AboutMain from "../../sharedComponents/AboutMain";
import OurValues from "../../components/About/OurValues";
import CounterMain from "../../components/About/CounterMain";
import AboutTeam from "../../components/About/AboutTeam";
import AboutTestimonial from "../../components/About/AboutTestimonial";
import Instagram from "../../components/Home/Instagram";
import { Trans, useTranslation } from "react-i18next";
import SEO from "../../utils/SEO";

export default function AboutFounder() {
  const { t } = useTranslation(["about", "common"]);
  const { cmnBannerTitle } = t("aboutTheFounder") || {};
  const { title, subtitle, mainPara, para2, para3, para4, para5 } =
    t("aboutMain", { ns: "common" }) || {};

  return (
    <div>
      <SEO page="aboutTheFounder" />

      <CmnBanner title={cmnBannerTitle}></CmnBanner>
      <AboutMain
        title={<Trans i18nKey={title} components={{ break: <br /> }} />}
        subtitle={subtitle}
        mainPara={mainPara}
        para2={para2}
        para3={para3}
        para4={para4}
        para5={para5}
      ></AboutMain>
      <OurValues></OurValues>
      <CounterMain></CounterMain>
      <AboutTeam></AboutTeam>
      <AboutTestimonial></AboutTestimonial>
    </div>
  );
}
