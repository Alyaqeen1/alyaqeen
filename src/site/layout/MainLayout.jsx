import React, { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router";

import TopHeader from "../components/TopHeader/TopHeader";
import Header from "../components/Header/Header";

import Footer from "../components/Footer/Footer";
import InitAnimations from "../components/InitAnimations";
import LanguageModal from "../components/AdditionalPages/LanguageModal";

export default function MainLayout() {
  return (
    <div>
      <ScrollRestoration></ScrollRestoration>
      <TopHeader></TopHeader>
      <LanguageModal></LanguageModal>
      <Header></Header>
      {/* from here wil be dynamic */}
      <Outlet></Outlet>
      <Footer></Footer>
      {/* <InitAnimations /> */}
    </div>
  );
}
