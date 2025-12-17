import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import SyllabusPlan from "../../components/AdditionalPages/SyllabusPlan";
import SEO from "../../utils/SEO";

export default function OurSyllabus() {
  return (
    <div>
      <SEO page="ourSyllabus" />
      <CmnBanner title="Our Syllabus"></CmnBanner>
      <SyllabusPlan></SyllabusPlan>
    </div>
  );
}
