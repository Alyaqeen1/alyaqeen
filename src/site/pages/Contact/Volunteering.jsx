import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import AboutMain from "../../sharedComponents/AboutMain";

export default function Volunteering() {
  return (
    <div>
      <CmnBanner title="Volunteering" />
      <AboutMain
        title="Volunteering"
        subtitle="Volunteering"
        mainPara="Alyaqeen academy was established in September 2020, under the guidance of Shaikh Mohammad Khalid in Birmingham, United Kingdom. The purpose was to benefit the community at large by facilitating a learning centre whereby children and adults can learn the Quran and Islamic Studies."
        para2="So whether you want to become a Hafiz of the Quran, learn about the religion, brush up on your tajweed or even start from the very beginning, Alyaqeen Academy is the place for you. Rooted with Islamic morals and teachings everyone at Alyaqeen academy is welcome to learn the sacred sciences and become closer to Allah SWT The Most High."
        para3="In addition to this we at Alyaqeen academy appreciate the balance between deen and dunya and therefore also provide tuition for Maths, Science and English for KS1- KS4. Our teachers and tutors are dedicated to try to ensure that all our students fulfil their full academic potential and obtain the best possible academic results they can."
        para4="Students can improve on their Maths, Science and English as each and every student is provided with assistance according to his/her academic needs."
      ></AboutMain>
    </div>
  );
}
