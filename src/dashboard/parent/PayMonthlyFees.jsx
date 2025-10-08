import React from "react";
import useAuth from "../../hooks/useAuth";
import MonthlyFeePayment from "./MonthlyFeePayment";
import { useGetEnrolledFullFamilyQuery } from "../../redux/features/families/familiesApi";

export default function PayMonthlyFees() {
  const { user } = useAuth();
  const { data: enrolledFamily } = useGetEnrolledFullFamilyQuery(user?.email, {
    skip: !user?.email,
  });

  return (
    <div>
      {enrolledFamily?.childrenDocs?.length > 0 && (
        <MonthlyFeePayment enrolledFamily={enrolledFamily}></MonthlyFeePayment>
      )}
    </div>
  );
}
