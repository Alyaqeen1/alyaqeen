import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import ServicesGrid from "../../components/AdditionalPages/ServicesGrid";

export default function AllServices() {
  return (
    <div>
      <CmnBanner title="All Services"></CmnBanner>
      <ServicesGrid></ServicesGrid>
    </div>
  );
}
