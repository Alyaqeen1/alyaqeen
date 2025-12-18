import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AboutMain from "../../sharedComponents/AboutMain";
import SEO from "../../utils/SEO";
import ContactSection from "../../components/Contact/ContactSection";

export default function AcademyVisit() {
  return (
    <div>
      <SEO page="academyVisit" />
      <CmnBanner title="Visit the Academy" />
      <ContactSection></ContactSection>
    </div>
  );
}
