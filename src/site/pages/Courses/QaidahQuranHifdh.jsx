import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import CourseDetails from "../../components/Course/CourseDetails";
export default function QaidahQuranHifdh() {
  return (
    <div>
      <CmnBanner title="Arabic Qaidah, Quran & Hifdh"></CmnBanner>
      <CourseDetails
        image="https://talibiq.s3.eu-west-2.amazonaws.com/al-yaqeen/web/images/assets/img/home/photo-5.jpg"
        title="Arabic Qaidah, Quran & Hifdh"
        subtitle1="Descriptions"
        descriptionPara1="Allah swt the most says in the Quran : “and recite the Quran (aloud) in a slow , (Pleasent tone and) style - Sura Al Muzzamil - 73:1-4"
        descriptionPara2="It is a duty upon every Muslim : male or female to ensure that they recite the Quran correctly and in the manner prescribed by Allah swt the most merciful. We here at Alyaqeen academy have taken on the responsibility to try to ensure that Allah’s command in relation to the recitation of the Quran is fulfilled."
        descriptionPara3="We therefore provide Arabic Qaida and Quran lessons to both adult male and female as well as children. We also provide classes for hifz for those student who wish to memorise the Quran. Our students are taught by qualified teachers from all over the world. Therefore whether you are a beginner, would like to memorise the Quran or anywhere in between, then Alyaqeen Academy is the place for you or your child"
        descriptionPara4=""
        descriptionPara5=""
        descriptionPara6=""
        subtitle2="Course structure"
        structurePara1="Students first complete the Arabic book (Qaidah) allowing them to recognise arabic letters and form words; this is known as Stage 1 and consists of 13 levels"
        structurePara2="Upon succesfully completing the 13 levels, students go on to Stage 2 whereby they begin to learn the Tajweed rules. Stage 2 consists of Levels' 14 to 20 and upon successfully completing this stage, students begin to read the Quran."
        structurePara3="When starting to read the Quran, students will start of by reading Juz (para) 30. By going through Stage 1 and Stage 2;"
        structurePara4="studnets will hopefully be in a position whereby they will be able to read the Quran fluently and with the proper method."
        structurePara5="Upon students finishing reading Juz (para) 30; students' and parents' can decide as to whether the students begins the memorisation of the Quran or whether the students comeplets the reading the full quran under supervision."
        structurePara6="All subject matter will be taught with the rules of tajweed and the correct pronunciation"
        detailsObj={{
          age: "5-15",
          weeklyDays: "4",
          weekendDays: "2",
          weekdaysDuration: "4:30 - 6:00pm",
          weekendsDuration: "10am - 12:30pm",
          weeklyHours: "2",
          weekendHours: "4",
        }}
      ></CourseDetails>
    </div>
  );
}
