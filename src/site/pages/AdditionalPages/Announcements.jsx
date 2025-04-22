import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AnnouncementsGrid from "../../components/AdditionalPages/AnnouncementsGrid";

export default function Announcements() {
  return (
    <div>
      <CmnBanner title="Announcements"></CmnBanner>
      <AnnouncementsGrid></AnnouncementsGrid>
    </div>
  );
}
