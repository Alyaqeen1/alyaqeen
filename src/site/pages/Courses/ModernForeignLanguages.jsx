import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import CourseDetails from "../../components/Course/CourseDetails";

export default function ModernForeignLanguages() {
  return (
    <div>
      <CmnBanner title="Modern Foreign Languages"></CmnBanner>
      <CourseDetails
        image="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/photo-5.jpg"
        title="Modern Foreign Languages"
        subtitle1="Descriptions"
        descriptionPara1="Allah the Master of the universe states in the Quran: “O mankind, We created you from one man and one woman, and then divided you into nations and tribes so that you may recognize one another”."
        descriptionPara2="We at Alyaqeen academy understand the importance of diversity and interaction with other cultures and backgrounds. We therefore provide an opportunity to learn the following languages at the academy:"
        descriptionPara3="✔ Arabic"
        descriptionPara4="✔ Urdu"
        descriptionPara5="✔ Bangla"
        descriptionPara6="We hope that learning to read and write and additional language will not only allow our students to interact with people from different backgrounds but also provide them with opportunities to excel in the working environment as they may be able to add an additional language to their CV. However most importantly being able to understand the Arabic language will allow you to understand the Quran."
        subtitle2="Course structure"
        structurePara1="Students are taught the relevent language by experianced teacher. Our language teacher have a combined teaching experiance of over 30 years."
        structurePara2="Upon learning the language we can make arrangments for students to sit a GCSE examination in the language of their choice"
        structurePara3=""
        structurePara4=""
        structurePara5=""
        structurePara6=""
        detailsObj={{
          age: "5-15",
          weeklyDays: "4",
          weekendDays: "2",
          weekdaysDuration: "6:00 - 7:00pm",
          weekendsDuration: "11:00am - 1:00pm",
          weeklyHours: "1",
          weekendHours: "2",
        }}
      ></CourseDetails>
    </div>
  );
}
