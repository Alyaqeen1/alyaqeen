import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import NewsList from "../../components/AdditionalPages/NewsList";

export default function PhotosVideos() {
  return (
    <div>
      <CmnBanner title="Photos & Videos"></CmnBanner>
      <NewsList></NewsList>
    </div>
  );
}
