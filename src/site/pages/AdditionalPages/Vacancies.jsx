import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import VacanciesGrid from "../../components/AdditionalPages/VacanciesGrid";

export default function Vacancies() {
  return (
    <div>
      <CmnBanner title="Vacancies"></CmnBanner>
      <VacanciesGrid></VacanciesGrid>
    </div>
  );
}
