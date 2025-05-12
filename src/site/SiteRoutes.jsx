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
import OurSyllabus from "./pages/AdditionalPages/OurSyllabus";
import StaffDetails from "./sharedComponents/StaffDetails";
import ServicesDetails from "./sharedComponents/ServicesDetails";
import Announcements from "./pages/AdditionalPages/Announcements";
import ErrorPage from "./pages/ErrorPage";
import Fees from "./pages/AdditionalPages/Fees";
import Holidays from "./pages/AdditionalPages/Holidays";
import Session from "./pages/AdditionalPages/Session";
import ApplyNow from "./pages/AdditionalPages/ApplyNow";
import AllServices from "./pages/AdditionalPages/AllServices";
import NewsDetails from "./sharedComponents/NewsDetails";
import VacancyDetails from "./sharedComponents/VacancyDetails";
import Complaint from "./pages/AdditionalPages/Complaint";
import Register from "./pages/Authentication/Register";

const siteRoutes = [
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    // errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      // about us routes
      {
        path: "/about-founder",
        element: <AboutFounder></AboutFounder>,
      },
      {
        path: "/about",
        element: <WhoWeAre></WhoWeAre>,
      },
      {
        path: "/our-team",
        element: <MeetTeam></MeetTeam>,
      },
      {
        path: "/our-vision",
        element: <MissionVisionValues></MissionVisionValues>,
      },
      // courses routes
      {
        path: "/arabic-qaidah-quran-hifdh",
        element: <QaidahQuranHifdh></QaidahQuranHifdh>,
      },
      {
        path: "/maths-english-science",
        element: <MathEnglishScience></MathEnglishScience>,
      },
      {
        path: "/arabic-language",
        element: <ArabicLanguage></ArabicLanguage>,
      },
      {
        path: "/modern-foreign-languages",
        element: <ModernForeignLanguages></ModernForeignLanguages>,
      },
      // additional pages
      {
        path: "/news",
        element: <NewsUpdates></NewsUpdates>,
      },
      {
        path: "/our-syllabus",
        element: <OurSyllabus></OurSyllabus>,
      },
      {
        path: "/weekdays",
        element: <Weekdays></Weekdays>,
      },
      {
        path: "/weekends",
        element: <Weekends></Weekends>,
      },
      {
        path: "/prayer-timetable",
        element: <PrayerTimetable></PrayerTimetable>,
      },
      {
        path: "/vacancies",
        element: <Vacancies></Vacancies>,
      },
      {
        path: "/faq",
        element: <Faq></Faq>,
      },
      {
        path: "/shop",
        element: <Shop></Shop>,
      },
      {
        path: "/photos-videos",
        element: <PhotosVideos></PhotosVideos>,
      },
      // contact
      {
        path: "/contact",
        element: <ContactUs></ContactUs>,
      },
      {
        path: "/academy-visit",
        element: <AcademyVisit></AcademyVisit>,
      },
      {
        path: "/volunteering",
        element: <Volunteering></Volunteering>,
      },
      {
        path: "/feedback",
        element: <Feedback></Feedback>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/staff-details/:id",
        element: <StaffDetails></StaffDetails>,
      },
      {
        path: "/service/:category",
        element: <ServicesDetails></ServicesDetails>,
      },
      {
        path: "/announcements",
        element: <Announcements></Announcements>,
      },
      {
        path: "/fees",
        element: <Fees></Fees>,
      },
      {
        path: "/holidays",
        element: <Holidays></Holidays>,
      },
      {
        path: "/session-timings",
        element: <Session></Session>,
      },
      {
        path: "/apply-now",
        element: <ApplyNow></ApplyNow>,
      },
      {
        path: "/all-services",
        element: <AllServices></AllServices>,
      },
      {
        path: "/news-details/:categoryId/:newsId",
        element: <NewsDetails></NewsDetails>,
      },
      {
        path: "/vacancy-details/:id",
        element: <VacancyDetails></VacancyDetails>,
      },
      {
        path: "/complaint",
        element: <Complaint></Complaint>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "*",
        element: <ErrorPage></ErrorPage>,
      },
    ],
  },
];

export default siteRoutes;
