import React from "react";
import CmnBanner from "../../sharedComponents/CmnBanner";
import LoginComp from "../../components/Authentication/LoginComp";
import LanguageModal from "../../components/AdditionalPages/LanguageModal";

export default function Login() {
  return (
    <div>
      <CmnBanner title="Login"></CmnBanner>
      <LoginComp></LoginComp>
    </div>
  );
}
