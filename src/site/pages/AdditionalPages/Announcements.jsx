import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import VacanciesGrid from "../../components/AdditionalPages/VacanciesGrid";

export default function Announcements() {
  return (
    <div>
      <CmnBanner title="Announcements"></CmnBanner>
      <h4 className="text-center"> announcement page will be dynamic</h4>
      <VacanciesGrid></VacanciesGrid>
    </div>
  );
}
