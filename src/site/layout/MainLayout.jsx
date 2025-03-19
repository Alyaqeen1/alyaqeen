import React, { useEffect } from "react";
import { Outlet } from "react-router";
// import "../styles/scss/main.scss";
import TopHeader from "../components/TopHeader/TopHeader";
import Header from "../components/Header/Header";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import Footer from "../components/Footer/Footer";

export default function MainLayout() {
  useEffect(() => {
    AOS.init({
      // duration: 1000, // Animation duration
      once: false, // Ensures animation happens once when scrolling
    });
  }, []);
  return (
    <div className="bg-white">
      <TopHeader></TopHeader>
      <Header></Header>
      {/* from here wil be dynamic */}
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
}
