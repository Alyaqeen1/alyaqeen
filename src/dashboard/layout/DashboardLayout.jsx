import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";
import OffCanvasMenu from "../components/Sidebar/OffCanvasMenu";

export default function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update the isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="row" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar></Sidebar>

      {/* Main Content Area */}
      <div className="col-md-9 col-lg-10">
        {isMobile && <OffCanvasMenu></OffCanvasMenu>}

        {/* Content Area */}
        <div className="container mt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
