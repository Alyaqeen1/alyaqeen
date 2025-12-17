import React from "react";
import CmnBanner from "../../../sharedComponents/CmnBanner";
import AboutMain from "../../../sharedComponents/AboutMain";
import weekdaysImage from "../../../assets/img/Weekdays_Classes_Academic_Calendar.jpg";
import weekdaysPDF from "/file/Weekdays_Classes_Academic_Calendar_2024-25_Sheet1.pdf";

export default function Weekdays() {
  return (
    <div>
      <CmnBanner title="Weekdays Calendar" />
      <AboutMain
        pdf={weekdaysPDF}
        image={weekdaysImage}
        title="Weekdays Academic Calendar 2025-2026"
        subtitle="Academic Schedule"
        mainPara="View the complete academic calendar for weekdays classes for the academic year 2025-2026. This calendar includes all important dates, holidays, and special events."
        isCalendar={true} // This enables the calendar view
        para2=""
        para3=""
        para4=""
        para5=""
      ></AboutMain>
    </div>
  );
}
