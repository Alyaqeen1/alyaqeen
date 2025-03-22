import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import PrayerComp from "../../components/AdditionalPages/PrayerComp";

export default function PrayerTimetable() {
  return (
    <div>
      <CmnBanner title="Prayer Timetable"></CmnBanner>
      <PrayerComp></PrayerComp>
    </div>
  );
}
