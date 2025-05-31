import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import LoadingSpinnerDash from "../dashboard/components/LoadingSpinnerDash";
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log(loading);
  if (loading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={location.pathname}></Navigate>;
}
