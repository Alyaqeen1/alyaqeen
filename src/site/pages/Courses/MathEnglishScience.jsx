import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import CourseDetails from "../../components/Course/CourseDetails";

export default function MathEnglishScience() {
  return (
    <div>
      <CmnBanner title="Maths, English & Science"></CmnBanner>
      <CourseDetails
        image="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/photo-5.jpg"
        title="Maths, English & Science"
        subtitle1="Descriptions"
        descriptionPara1="At Alyaqeen Academy, we have a team of dedicated tutors who are committed to providing quality education. Our tutors ensure that students are taught according to the national curriculum syllabus while also catering to their individual learning needs."
        descriptionPara2="Many students who receive tuition at Alyaqeen Academy have shown significant progress in their school learning, with some even moving up grades. Our personalized approach helps students build confidence and achieve better academic results."
        descriptionPara3="Whether your child needs extra support to improve their grades or requires tuition to reach a satisfactory level due to underperformance at school, Alyaqeen Academy is the right place to help them succeed."
        descriptionPara4=""
        descriptionPara5=""
        descriptionPara6=""
        subtitle2="Course structure"
        structurePara1="✔ KS1 and KS2 – Maths and English"
        structurePara2="✔ KS3 – Maths and English"
        structurePara3="✔ KS4 – Maths, Science and English (GCSE)"
        structurePara4=""
        structurePara5=""
        structurePara6=""
        detailsObj={{
          age: "5-15",
          weeklyDays: "4",
          weekendDays: "2",
          weekdaysDuration: "5:00 - 7:00pm",
          weekendsDuration: "10:00am - 12:00pm",
          weeklyHours: "2",
          weekendHours: "2",
        }}
      ></CourseDetails>
    </div>
  );
}
