import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import ContactSection from "../../components/Contact/ContactSection";
import SEO from "../../utils/SEO";

export default function ContactUs() {
  return (
    <div>
      <SEO page="contactUs" />
      <CmnBanner title="Contact Us"></CmnBanner>
      <ContactSection></ContactSection>
    </div>
  );
}
