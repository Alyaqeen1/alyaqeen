import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/Routes.jsx";
import InitAnimations from "./site/components/InitAnimations.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "./site/i18n.js";
import LoadingSpinner from "./site/components/LoadingSpinner.jsx";
import React from "react";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <React.Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <InitAnimations />
        <Toaster />
      </Provider>
    </React.Suspense>
  </StrictMode>
);
