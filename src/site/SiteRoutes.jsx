import React from "react";
import { Route, Routes } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import AboutFounder from "./pages/About-us/AboutFounder";
import WhoWeAre from "./pages/About-us/WhoWeAre";
import MeetTeam from "./pages/About-us/MeetTeam";
import MissionVisionValues from "./pages/About-us/MissionVisionValues";
import QaidahQuranHifdh from "./pages/Courses/QaidahQuranHifdh";
import MathEnglishScience from "./pages/Courses/MathEnglishScience";
import ArabicLanguage from "./pages/Courses/ArabicLanguage";
import ModernForeignLanguages from "./pages/Courses/ModernForeignLanguages";
import News from "./pages/AdditionalPages/NewsUpdates";
import NewsUpdates from "./pages/AdditionalPages/NewsUpdates";
import Weekdays from "./pages/AdditionalPages/AcademicCalendar/Weekdays";
import Weekends from "./pages/AdditionalPages/AcademicCalendar/Weekends";
import PrayerTimetable from "./pages/AdditionalPages/PrayerTimetable";
import Vacancies from "./pages/AdditionalPages/Vacancies";
import Faq from "./pages/AdditionalPages/Faq";
import Shop from "./pages/AdditionalPages/Shop";
import PhotosVideos from "./pages/AdditionalPages/PhotosVideos";
import ContactUs from "./pages/Contact/ContactUs";
import AcademyVisit from "./pages/Contact/AcademyVisit";
import Volunteering from "./pages/Contact/Volunteering";
import Feedback from "./pages/Contact/Feedback";
import Login from "./pages/Authentication/Login";

export default function SiteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout></MainLayout>}>
        <Route index element={<Home />} />

        {/* about us routes */}
        <Route path="/about-founder" element={<AboutFounder></AboutFounder>} />
        <Route path="/about" element={<WhoWeAre></WhoWeAre>} />
        <Route path="/our-team" element={<MeetTeam></MeetTeam>} />
        <Route
          path="/our-vision"
          element={<MissionVisionValues></MissionVisionValues>}
        />

        {/* courses routes */}
        <Route
          path="/qaidah-quran-hifdh"
          element={<QaidahQuranHifdh></QaidahQuranHifdh>}
        />
        <Route
          path="/maths-english-science"
          element={<MathEnglishScience></MathEnglishScience>}
        />
        <Route
          path="/arabic-language"
          element={<ArabicLanguage></ArabicLanguage>}
        />
        <Route
          path="/modern-foreign-languages"
          element={<ModernForeignLanguages></ModernForeignLanguages>}
        />

        {/* additional pages  */}
        <Route path="/news" element={<NewsUpdates></NewsUpdates>} />
        <Route path="/weekdays" element={<Weekdays></Weekdays>} />
        <Route path="/weekends" element={<Weekends></Weekends>} />
        <Route
          path="/prayer-timetable"
          element={<PrayerTimetable></PrayerTimetable>}
        />
        <Route path="/vacancies" element={<Vacancies></Vacancies>} />
        <Route path="/faq" element={<Faq></Faq>} />
        <Route path="/shop" element={<Shop></Shop>} />
        <Route path="/photos-videos" element={<PhotosVideos></PhotosVideos>} />

        {/* contact */}
        <Route path="/contact" element={<ContactUs></ContactUs>} />
        <Route path="/academy-visit" element={<AcademyVisit></AcademyVisit>} />
        <Route path="/volunteering" element={<Volunteering></Volunteering>} />
        <Route path="/feedback" element={<Feedback></Feedback>} />

        {/* login */}
        <Route path="/login" element={<Login></Login>} />
      </Route>
    </Routes>
  );
}
