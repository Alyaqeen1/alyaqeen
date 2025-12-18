import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AboutMain from "../../sharedComponents/AboutMain";
import SEO from "../../utils/SEO";
import ContactSection from "../../components/Contact/ContactSection";

export default function Feedback() {
  return (
    <div>
      <SEO page="feedback" />
      <CmnBanner title="Feedback" />
      <ContactSection></ContactSection>
    </div>
  );
}
