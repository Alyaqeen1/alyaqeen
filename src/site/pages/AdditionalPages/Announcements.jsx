import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AnnouncementsGrid from "../../components/AdditionalPages/AnnouncementsGrid";
import SEO from "../../utils/SEO";

export default function Announcements() {
  return (
    <div>
      <SEO page="announcements" />
      <CmnBanner title="Announcements"></CmnBanner>
      <AnnouncementsGrid></AnnouncementsGrid>
    </div>
  );
}
