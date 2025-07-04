import React from "react";
import FeeChoiceModal from "../../shared/FeeChoiceModal";
import { useGetRoleQuery } from "../../../redux/features/role/roleApi";
import useAuth from "../../../hooks/useAuth";
import { useGetAllFullFamilyQuery } from "../../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../../components/LoadingSpinnerDash";
import { Link } from "react-router";
import ParentDashboard from "../../parent/ParentDashboard";
import TeacherDashboard from "../../teacher/TeacherDashboard";
import AdminDashboard from "../../admin/AdminDashboard";

export default function Home() {
  const { user } = useAuth();

  // Fetch user role
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery(
    user?.email,
    {
      skip: !user?.email,
    }
  );

  // Fetch family data with childrenDocs
  const {
    data: family,
    isLoading: isFamilyLoading,
    refetch,
  } = useGetAllFullFamilyQuery(user?.email, {
    skip: !user?.email,
    // pollingInterval: 1000, // 10 seconds in milliseconds
  });

  if (isRoleLoading || isFamilyLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  return (
    <div>
      {roleData?.role === "admin" && <AdminDashboard></AdminDashboard>}
      {roleData?.role === "parent" && (
        <ParentDashboard family={family} refetch={refetch}></ParentDashboard>
      )}
      {roleData?.role === "teacher" && <TeacherDashboard></TeacherDashboard>}

      {/* {shouldShowModal && <FeeChoiceModal refetch={refetch} />} */}
    </div>
  );
}
