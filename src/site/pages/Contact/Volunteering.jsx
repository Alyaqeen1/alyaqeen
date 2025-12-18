import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AboutMain from "../../sharedComponents/AboutMain";
import SEO from "../../utils/SEO";
import ContactSection from "../../components/Contact/ContactSection";

export default function Volunteering() {
  return (
    <div>
      <SEO page="volunteering" />
      <CmnBanner title="Volunteering" />
      <ContactSection></ContactSection>
    </div>
  );
}
