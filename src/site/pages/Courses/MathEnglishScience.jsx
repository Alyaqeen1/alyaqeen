import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import CourseDetails from "../../components/Course/CourseDetails";
import one from "../../assets/img/program/course4.png";

export default function MathEnglishScience() {
  return (
    <div>
      <CmnBanner title="Maths, English & Science"></CmnBanner>
      <CourseDetails
        image={one}
        classNum={5}
        classTeacher={"Miss Amina and Jabir. ludhi G1 and G2"}
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
          session01: "4:30 - 6:00pm",
          session02: "5:45 - 7:15pm",
          morning: "10am - 12:30pm",
          afternoon: "12:30 - 2:30pm",
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
