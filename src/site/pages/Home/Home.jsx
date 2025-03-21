import React from "react";
import Banner from "../../components/Home/Banner";
import AboutSection from "../../components/Home/AboutSection";
import News from "../../components/Home/News";
import AboutActivities from "../../components/Home/AboutActivities";
import ProgramSection from "../../components/Home/ProgramSection";
import WorkProcess from "../../components/Home/WorkProcess";
import Marquee from "../../components/Home/Marquee";
import Certificate from "../../components/Home/Certificate";
import Team from "../../components/Home/Team";
import TestimonialOne from "../../components/Home/TestimonialOne";
import TestimonialTwo from "../../components/Home/TestimonialTwo";
import CTA from "../../components/Home/CTA";
import MainCta from "../../components/Home/MainCTA";
import Instagram from "../../components/Home/Instagram";
import Blogs from "../../components/Home/Blogs";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <News></News>
      <AboutActivities></AboutActivities>
      <ProgramSection></ProgramSection>
      <WorkProcess></WorkProcess>
      <Marquee></Marquee>
      <Certificate></Certificate>
      <Team></Team>
      <TestimonialOne></TestimonialOne>
      <TestimonialTwo></TestimonialTwo>
      <CTA></CTA>
      <Blogs></Blogs>
      <MainCta></MainCta>
      <Instagram></Instagram>
      <AboutSection></AboutSection>
    </div>
  );
}
