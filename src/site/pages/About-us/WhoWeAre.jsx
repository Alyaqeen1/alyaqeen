import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AboutMain from "../../sharedComponents/AboutMain";
import OurValues from "../../components/About/OurValues";
import CounterMain from "../../components/About/CounterMain";
import AboutTeam from "../../components/About/AboutTeam";
import AboutTestimonial from "../../components/About/AboutTestimonial";
import Instagram from "../../components/Home/Instagram";

export default function WhoWeAre() {
  return (
    <div>
      <CmnBanner title="About Us"></CmnBanner>
      <AboutMain></AboutMain>
      <OurValues></OurValues>
      <CounterMain></CounterMain>
      <AboutTeam></AboutTeam>
      <AboutTestimonial></AboutTestimonial>
      <Instagram></Instagram>
    </div>
  );
}
