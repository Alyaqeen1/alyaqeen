import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const InitAnimations = () => {
  useEffect(() => {
    AOS.init({
      once: false, // Animations occur every time elements scroll into view
      mirror: true, // Elements animate out while scrolling past them
    });
  }, []);
  return null;
};

export default InitAnimations;
