import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import MissionVision from "../../components/About/MissionVision";
import AllThree from "../../components/About/AllThree";
import Values from "../../components/About/Values";

export default function MissionVisionValues() {
  return (
    <div>
      <CmnBanner title="Our Vision, mission & values" />
      <MissionVision></MissionVision>
      <Values></Values>
      <AllThree></AllThree>
    </div>
  );
}
