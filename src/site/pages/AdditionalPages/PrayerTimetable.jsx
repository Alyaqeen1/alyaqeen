import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import PrayerComp from "../../components/AdditionalPages/PrayerComp";
import SEO from "../../utils/SEO";

export default function PrayerTimetable() {
  return (
    <div>
      <SEO page="prayer-timetable" />
      <CmnBanner title="Prayer Timetable"></CmnBanner>
      <PrayerComp></PrayerComp>
    </div>
  );
}
