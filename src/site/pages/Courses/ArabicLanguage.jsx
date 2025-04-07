import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import CourseDetails from "../../components/Course/CourseDetails";

export default function ArabicLanguage() {
  return (
    <div>
      <CmnBanner title="Arabic Language"></CmnBanner>
      <CourseDetails
        image="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/program/course1.jpeg"
        title="Arabic Language"
        subtitle1="Descriptions"
        descriptionPara1="Islam is just not religion that Muslims follow, but it is a way of life."
        descriptionPara2="When a person is born the first words that are recited in his or her ear is Allahu Akbar and the last words when they are prayed upon is Allah."
        descriptionPara3="The Quran starts with “in the name of Allah, the most merciful, the most kind“ and ends“Nas” which translates from Arabic into English as mankind."
        descriptionPara4="Therefore it is essential, that a Believer lives by the law’s of Allah the most Just."
        descriptionPara5="At Alyaqeen academy your child has the opportunity to learn about the the religion of Allah from qualified teacher’s from around the world whom have approximately 30 years of combined teaching experience."
        descriptionPara6="Students are taught in a fun and friendly atmosphere. Our teachers use various methods and equipment to ensure that our students are always engaged and most of all always learning"
        subtitle2="Course structure"
        structurePara1="The syllabus consists of:"
        structurePara2="✔ A) Masnoon duas for day to day life"
        structurePara3="✔ B) 20 sura’s from Juz Amma (para)"
        structurePara4="✔ C) Islamic History"
        structurePara5="✔ D) Islamic etiquette’s and moral’s"
        structurePara6="✔ E) How to overcome challanges in accordance to Islam"
        detailsObj={{
          age: "5-15",
          weeklyTiming: "4:30 - 6:00pm / 5:45 - 7:15pm",
          weekendTiming: "10am - 12:30pm / 12:30 - 2:30pm",
          weeklyDays: "Mon-Thu",
          weekendDays: "Sat-Sun",
          weekdaysDuration: "1.5",
          weekendsDuration: "2.5",
          weeklyHours: "6",
          weekendHours: "5",
        }}
      ></CourseDetails>
    </div>
  );
}
