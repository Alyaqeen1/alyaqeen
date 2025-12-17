import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import LoginComp from "../../components/Authentication/LoginComp";
import SEO from "../../utils/SEO";

export default function Login() {
  return (
    <div>
      <SEO page="login" />
      <CmnBanner title="Login"></CmnBanner>
      <LoginComp></LoginComp>
    </div>
  );
}
