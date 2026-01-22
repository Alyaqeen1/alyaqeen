import React from "react";
import NewsList from "../../components/AdditionalPages/NewsList";
import CmnBanner from "../../sharedComponents/CmnBanner";
import SEO from "../../utils/SEO";

export default function NewsUpdates() {
  return (
    <div>
      <SEO page="Blogs" />

      <CmnBanner title="Blogs"></CmnBanner>
      <NewsList></NewsList>
    </div>
  );
}
