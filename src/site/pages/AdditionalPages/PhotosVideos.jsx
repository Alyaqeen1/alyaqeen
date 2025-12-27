import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import NewsList from "../../components/AdditionalPages/NewsList";
import SEO from "../../utils/SEO";
import { useGetWebsiteSectionQuery } from "../../../redux/features/website_settings/website_settingsApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import SimpleGallery from "../../components/Home/SimpleGallery";

export default function PhotosVideos() {
  const {
    data: gallery,
    isLoading,
    isError,
    refetch,
  } = useGetWebsiteSectionQuery("gallery");
  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <div>
      <SEO page="photosVideos" />
      <CmnBanner title="Photos & Videos"></CmnBanner>
      <SimpleGallery gallery={gallery}></SimpleGallery>
    </div>
  );
}
