import React from "react";
import CmnBanner from "../sharedComponents/CmnBanner";
import ErrorSection from "../components/ErrorSection";

export default function ErrorPage() {
  return (
    <div>
      <CmnBanner title="Page Not Found"></CmnBanner>
      <ErrorSection></ErrorSection>
    </div>
  );
}
