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
import AuthProvider from "./AuthProvider/AuthProvider.jsx";
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <React.Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
      <Provider store={store}>
        <HelmetProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <InitAnimations />
            <Toaster />
          </AuthProvider>
        </HelmetProvider>
      </Provider>
    </React.Suspense>
  </StrictMode>
);
