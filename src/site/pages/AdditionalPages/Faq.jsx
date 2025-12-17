import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import FaqSection from "../../components/AdditionalPages/FaqSection";
import SEO from "../../utils/SEO";

export default function Faq() {
  return (
    <div>
      <SEO page="faqs" />
      <CmnBanner title="FAQ's"></CmnBanner>
      <FaqSection></FaqSection>
    </div>
  );
}
