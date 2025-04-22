import React, { useEffect, useState } from "react";
import CmnBanner from "./CmnBanner";
import axios from "axios";
import { useParams } from "react-router";
import AboutMain from "./AboutMain";

export default function ServicesDetails() {
  const [service, setService] = useState({});
  const { category } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/services.json");

      const service = data.find((single) => single.category === category);
      setService(service);
    };
    fetchData();
  }, []);
  return (
    <div>
      <CmnBanner
        title={service?.name !== "Nikah" ? service?.name : service?.title}
      ></CmnBanner>
      <AboutMain
        image={service?.details_img}
        title={service?.title}
        subtitle={service?.title}
        mainPara={service?.mainPara}
        para2={service?.para2}
        para3={service?.para3}
        para4={service?.para4}
        para5={service?.para5}
        para6={service?.para6}
      ></AboutMain>
    </div>
  );
}
