import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import NewsList from "../../components/AdditionalPages/NewsList";
import SEO from "../../utils/SEO";

export default function PhotosVideos() {
  return (
    <div>
      <SEO page="photosVideos" />
      <CmnBanner title="Photos & Videos"></CmnBanner>
      <NewsList></NewsList>
    </div>
  );
}
