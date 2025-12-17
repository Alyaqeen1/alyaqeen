import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import ComplaintComp from "../../components/AdditionalPages/ComplaintComp";
import SEO from "../../utils/SEO";

export default function Complaint() {
  return (
    <div>
      <SEO page="complaints" />
      <CmnBanner title="Complaint"></CmnBanner>
      <ComplaintComp></ComplaintComp>
    </div>
  );
}
