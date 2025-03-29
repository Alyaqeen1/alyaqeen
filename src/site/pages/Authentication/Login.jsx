import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import LoginComp from "../../components/Authentication/LoginComp";

export default function Login() {
  return (
    <div>
      <CmnBanner title="Login"></CmnBanner>
      <LoginComp></LoginComp>
    </div>
  );
}
