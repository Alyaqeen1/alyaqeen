import React from "react";
import NewsList from "../../components/AdditionalPages/NewsList";
import CmnBanner from "../../sharedComponents/CmnBanner";

export default function NewsUpdates() {
  return (
    <div>
      <CmnBanner title="News & Updates"></CmnBanner>
      <NewsList></NewsList>
    </div>
  );
}
