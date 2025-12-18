import React from "react";
import CmnBanner from "../../../sharedComponents/CmnBanner";
import AboutMain from "../../../sharedComponents/AboutMain";
import weekendImage from "../../../assets/img/Weekdend_Academic_Calendar.jpg";
import weekendPDF from "/file/Weekdend_Academic_Calendar_2025-26_Sheet1.pdf";
import SEO from "../../../utils/SEO";

export default function Weekends() {
  const weekendsCalendarData = {
    totalWeeks: 52,
    lessonWeeks: 48,
    holidayWeeks: 4,
    importantDates: [
      { date: "18th February", title: "Ramadan Begins" },
      { date: "19th March", title: "Eid al-Fitr" },
      { date: "27th May", title: "Eid al-Adha" },
      { date: "24th August", title: "Summer Holidays Begin" },
    ],
  };
  return (
    <div>
      <SEO page="weekends" />

      <CmnBanner title="Weekend Calendar" />
      <AboutMain
        pdf={weekendPDF}
        image={weekendImage}
        title="Weekend Academic Calendar 2025-2026"
        subtitle="Academic Schedule"
        mainPara="View the complete academic calendar for weekend classes for the academic year 2025-2026. This calendar includes all important dates, holidays, and special events."
        isCalendar={true} // Add this prop
        calendarData={weekendsCalendarData} // Pass the data here
        para2=""
        para3=""
        para4=""
        para5=""
      ></AboutMain>
    </div>
  );
}
