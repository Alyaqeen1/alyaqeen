import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

// i18n.use(LanguageDetector).use(initReactI18next).use(Backend).init({
//   debug: true,
//   lng: "en",
//   fallbackLng: "en",
//   returnObjects: true,
// });

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: true,
    lng: "en",
    fallbackLng: "en",
    returnObjects: true,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // <== This part is important!
    },
    ns: ["common", "home"], // list all namespaces (files)
    defaultNS: "common", // default one to fall back to
  });
