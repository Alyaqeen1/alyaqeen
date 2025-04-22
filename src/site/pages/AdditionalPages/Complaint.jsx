import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import ComplaintComp from "../../components/AdditionalPages/ComplaintComp";

export default function Complaint() {
  return (
    <div>
      <CmnBanner title="Complaint"></CmnBanner>
      <ComplaintComp></ComplaintComp>
    </div>
  );
}
