import React from "react";
import useAuth from "../../hooks/useAuth";
import MonthlyFeePayment from "./MonthlyFeePayment";
import { useGetEnrolledFullFamilyQuery } from "../../redux/features/families/familiesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function PayMonthlyFees() {
  const { user } = useAuth();
  const { data: enrolledFamily, isLoading } = useGetEnrolledFullFamilyQuery(
    user?.email,
    {
      skip: !user?.email,
    }
  );
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  if (isLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }
  return (
    <div>
      {enrolledFamily?.childrenDocs?.length > 0 ? (
        <MonthlyFeePayment enrolledFamily={enrolledFamily}></MonthlyFeePayment>
      ) : (
        <>
          <div style={gradientStyle} className="text-white p-4 rounded-5">
            <div className="d-flex align-items-center flex-wrap gap-4">
              No Students Found in the Family
            </div>
          </div>
        </>
      )}
    </div>
  );
}
