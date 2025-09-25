import React, { useEffect, useState } from "react";
import { useGetStudentsQuery } from "../../redux/features/students/studentsApi";
import {
  useGetEnrolledFullFamilyByIdQuery,
  useGetFamilyQuery,
} from "../../redux/features/families/familiesApi";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import {
  useCreateFeeDataMutation,
  useGetFeesByIdQuery,
} from "../../redux/features/fees/feesApi";
import { getUnpaidFees } from "../../utils/getUnpaidFees";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function AdminFeeUpdateModal({
  familyId,
  handleAdminClose,
  adminShowModal,
  refetch: familiesRefetch,
}) {
  const { data: enrolledFamily } = useGetEnrolledFullFamilyByIdQuery(familyId);
  const { data: fees = [] } = useGetFeesByIdQuery(enrolledFamily?._id);
  const { data: family } = useGetFamilyQuery(familyId);

  console.log(fees);
  return (
    <div>
      {adminShowModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${adminShowModal ? "show" : ""}`}
        style={{ display: adminShowModal ? "block" : "none", zIndex: 1050 }}
        onClick={(e) =>
          e.target.classList.contains("modal") && handleAdminClose()
        }
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">Pay Unpaid Fees</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleAdminClose}
              />
            </div>

            <div className="modal-body p-4">hello</div>
          </div>
        </div>
      </div>
    </div>
  );
}
