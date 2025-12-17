import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import OurTeacher from "../../components/About/OurTeacher";
import SEO from "../../utils/SEO";

export default function MeetTeam() {
  return (
    <div>
      <SEO page="meetTheTeam" />
      <CmnBanner title="Our Teacher" />
      <OurTeacher></OurTeacher>
    </div>
  );
}
