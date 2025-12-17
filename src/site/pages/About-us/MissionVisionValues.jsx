import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import MissionVision from "../../components/About/MissionVision";
import AllThree from "../../components/About/AllThree";
import Values from "../../components/About/Values";
import SEO from "../../utils/SEO";

export default function MissionVisionValues() {
  return (
    <div>
      <SEO page="missionVision" />
      <CmnBanner title="Our Vision, mission & values" />
      <MissionVision></MissionVision>
      <Values></Values>
      <AllThree></AllThree>
    </div>
  );
}
