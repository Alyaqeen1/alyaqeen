import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import VacanciesGrid from "../../components/AdditionalPages/VacanciesGrid";
import SEO from "../../utils/SEO";

export default function Vacancies() {
  return (
    <div>
      <SEO page="vacancies" />
      <CmnBanner title="Vacancies"></CmnBanner>
      <VacanciesGrid></VacanciesGrid>
    </div>
  );
}
