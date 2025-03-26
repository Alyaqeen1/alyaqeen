import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import CmnBanner from "./CmnBanner";
import TeacherDetailsBase from "../components/Home/TeacherDetailsBase";
import Team from "../components/Home/Team";
import AboutTeam from "../components/About/AboutTeam";

export default function StaffDetails() {
  const [staffData, setStaffData] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/staff.json");
      // console.log(data);
      const singleStaff = data.find((single) => single?.id === id);
      setStaffData(singleStaff);
    };
    fetchData();
  }, []);
  console.log(staffData);

  return (
    <div>
      <CmnBanner title="Teacher Details"></CmnBanner>
      <TeacherDetailsBase staffData={staffData}></TeacherDetailsBase>
      <AboutTeam title="Related Teacher" subtitle=""></AboutTeam>
    </div>
  );
}
