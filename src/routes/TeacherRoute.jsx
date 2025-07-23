import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import { useGetRoleQuery } from "../redux/features/role/roleApi";
import LoadingSpinner from "../site/components/LoadingSpinner";
import LoadingSpinnerDash from "../dashboard/components/LoadingSpinnerDash";

const TeacherRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { data, isLoading, isUninitialized } = useGetRoleQuery(user?.email, {
    skip: !user?.email, // avoid fetching if no ID
  });
  const location = useLocation();

  if (loading || isLoading || isUninitialized) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  if (user && data?.role === "teacher") {
    return children;
  }

  return <Navigate to="/" state={location.pathname} replace></Navigate>;
};

export default TeacherRoute;
