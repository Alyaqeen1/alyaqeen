import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AboutMain from "../../sharedComponents/AboutMain";
import OurValues from "../../components/About/OurValues";
import CounterMain from "../../components/About/CounterMain";
import AboutTeam from "../../components/About/AboutTeam";
import AboutTestimonial from "../../components/About/AboutTestimonial";
import Instagram from "../../components/Home/Instagram";

export default function AboutFounder() {
  return (
    <div>
      <CmnBanner title="About The Founder"></CmnBanner>
      <AboutMain
        title={`Managing Director &\nHeadteacher`}
        subtitle="Shaikh Mohammad Khalid"
        mainPara="Mr. Mohammad Khalid Habib is the Managing Director and Headteacher of Alyaqeen Academy. Mr. Khalid has developed his teaching skills through more than 16 years of experience and learning. Through this period he has spent three years in Quranic studies, two years of Tajweed and Qiraat. He has completed an eleven year comprehensive program of Arabic, Islamic and shariah studies."
        para2="where he studied Islamic sciences including Arabic, Rhetoric, Logic, Hadith, Quranic exegesis and Islamic shariah studies in Karachi Pakistan and the International Islamic University of Africa, Khartoum, Sudan."
        para3="Following this, Ustad also spent 5 years teaching Arabic, Islamic and shariah studies and 4 years in Journalism writing and editing Islamic and cultural articles and co-founder of a well known monthly magazine in Karachi. He has years of experience teaching Quran, Tafseer, Hadith, Fiqh, Tajweed, the Arabic language and served as an Imam in a local Islamic institute for the last 8 years."
        para4="He has also led the taraweeh prayers around the world for the past 25 years including the holy month of Ramadan. He also has 7 years of Imam experience delivering Eid and Jummah prayers. Mr Khalid has been a vital member of the Muslim community."
        para5="Mr Khalid has 10 years of teaching experience at a British School which includes two independent academies. More recently he successfully manages many students at the Alyaqeen Academy which offers students Arabic, Quran, Islamic Studies, English, Science and Maths."
      ></AboutMain>
      <OurValues></OurValues>
      <CounterMain></CounterMain>
      <AboutTeam></AboutTeam>
      <AboutTestimonial></AboutTestimonial>
      <Instagram></Instagram>
    </div>
  );
}
