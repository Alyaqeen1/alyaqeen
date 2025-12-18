import React from "react";
import CmnBanner from "../../../sharedComponents/CmnBanner";
import AboutMain from "../../../sharedComponents/AboutMain";
import weekdaysImage from "../../../assets/img/Weekdays_Classes_Academic_Calendar.jpg";
import weekdaysPDF from "/file/Weekdays_Classes_Academic_Calendar_2024-25_Sheet1.pdf";
import SEO from "../../../utils/SEO";

export default function Weekdays() {
  // Define weekdays-specific calendar data
  const weekdaysCalendarData = {
    totalWeeks: 52,
    lessonWeeks: 47,
    holidayWeeks: 5,
    importantDates: [
      { date: "18th February", title: "Ramadan Begins" },
      { date: "19th March", title: "Eid al-Fitr" },
      { date: "27th May", title: "Eid al-Adha" },
      { date: "24th August", title: "Summer Holidays Begin" },
    ],
  };

  return (
    <div>
      <SEO page="weekdays" />
      <CmnBanner title="Weekdays Calendar" />
      <AboutMain
        pdf={weekdaysPDF}
        image={weekdaysImage}
        title="Weekdays Academic Calendar 2025-2026"
        subtitle="Academic Schedule"
        mainPara="View the complete academic calendar for weekdays classes for the academic year 2025-2026. This calendar includes all important dates, holidays, and special events."
        isCalendar={true}
        calendarData={weekdaysCalendarData} // Pass the data here
        para2=""
        para3=""
        para4=""
        para5=""
      />
    </div>
  );
}
