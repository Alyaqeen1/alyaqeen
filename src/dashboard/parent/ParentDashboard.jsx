import React, { useState } from "react";
import AdmissionFeeModal from "../shared/AdmissionFeeModal";
import {
  useGetApprovedFullFamilyQuery,
  useGetEnrolledFullFamilyQuery,
} from "../../redux/features/families/familiesApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import { useUpdateStudentStatusMutation } from "../../redux/features/students/studentsApi";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useGetRoleQuery } from "../../redux/features/role/roleApi";
import FeeChoiceModal from "../shared/FeeChoiceModal";
import MonthlyFeePayment from "./MonthlyFeePayment";
import sessionMap from "../../utils/sessionMap";

export default function ParentDashboard({ family, refetch }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { user, loading } = useAuth();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const axiosPublic = useAxiosPublic();
  const {
    data: approvedFamily,
    isLoading,
    refetch: approvedRefetch,
  } = useGetApprovedFullFamilyQuery(user?.email, {
    skip: loading || !user?.email,
  });
  const { data: enrolledFamily } = useGetEnrolledFullFamilyQuery(user?.email, {
    skip: loading || !user?.email,
  });

  const { data: roleData, isLoading: isRoleLoading } = useGetRoleQuery(
    user?.email,
    {
      skip: !user?.email,
    }
  );

  const approvedChildAfter10th = approvedFamily?.childrenDocs?.some((child) => {
    if (child.status !== "approved" || !child.startingDate) return false;
    const startDate = new Date(child.startingDate);
    return startDate.getDate() > 10;
  });

  const shouldShowModal =
    roleData?.role === "parent" &&
    approvedChildAfter10th &&
    family?.feeChoice === null;

  const handleShow = (id) => {
    const blockedStudent = approvedFamily?.childrenDocs?.find((child) => {
      const startDate = new Date(child.startingDate);
      const feeChoice = approvedFamily?.feeChoice;
      return startDate.getDate() > 10 && !feeChoice;
    });

    if (blockedStudent) {
      return Swal.fire(
        "Action Required",
        `Please select a fee payment policy (pro-rata or full-month) for ${blockedStudent.name} before proceeding.`,
        "warning"
      );
    }

    // setSelectedStudentId(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const approvedStudentsCount =
    approvedFamily?.childrenDocs?.filter(
      (child) => child.status === "approved" || child.status === "enrolled"
    )?.length || 0;

  const getAdmissionFee = () => {
    const baseFee = 20;
    const discount = approvedStudentsCount > 2 ? 0.1 : 0;
    return baseFee - baseFee * discount;
  };

  const admissionFee = getAdmissionFee();

  if (isLoading || loading || isRoleLoading) {
    return <LoadingSpinnerDash />;
  }
  const approvedStudents = approvedFamily?.childrenDocs?.filter(
    (student) => student.status === "approved"
  );

  // if (!approvedStudents || approvedStudents.length === 0) {
  //   return Swal.fire("No approved students to process", "", "info");
  // }

  const feeDetails = approvedStudents.map((student, index) => {
    const startDate = new Date(student?.startingDate);
    const joinDay = startDate.getDate();
    const joiningMonth = startDate.getMonth(); // 0-indexed
    const joiningYear = startDate.getFullYear();

    const baseAdmissionFee = 20;
    const isThirdOrLaterStudent = index >= 2;
    const studentAdmissionFee = isThirdOrLaterStudent
      ? baseAdmissionFee * 0.9
      : baseAdmissionFee;

    const monthlyFee = student.monthly_fee || 0;

    // Calculate pro-rated monthly fee if applicable
    // const startDate = new Date(student.startingDate);
    const joinDate = startDate.getDate();
    let adjustedMonthlyFee = monthlyFee;

    if (family.feeChoice === "proRated" && joinDate > 10) {
      if (joinDate <= 20) {
        adjustedMonthlyFee = (2 / 3) * monthlyFee;
      } else {
        adjustedMonthlyFee = (1 / 3) * monthlyFee;
      }
    }

    const subtotal = studentAdmissionFee + adjustedMonthlyFee;

    return {
      studentId: student._id,
      name: student.name,
      admissionFee: studentAdmissionFee,
      monthlyFee: adjustedMonthlyFee,
      subtotal,
      joiningMonth,
      joiningYear,
    };
  });

  const grandTotal = feeDetails.reduce((acc, cur) => acc + cur.subtotal, 0);

  const handleOtherPayment = async (method) => {
    const blockedStudent = approvedFamily?.childrenDocs?.find((child) => {
      const startDate = new Date(child.startingDate);
      const feeChoice = approvedFamily?.feeChoice;
      return startDate.getDate() > 10 && !feeChoice;
    });
    if (blockedStudent) {
      return Swal.fire(
        "Action Required",
        `Please select a fee payment policy (pro-rata or full-month) for ${blockedStudent?.name} before proceeding.`,
        "warning"
      );
    }

    // if (!approvedStudents || approvedStudents.length === 0) {
    //   return Swal.fire("No approved students to process", "", "info");
    // }

    // ✅ Use each student's actual monthly_fee
    // const feeDetails = approvedStudents.map((student) => {
    //   const studentMonthlyFee = student.monthly_fee || 0;
    //   const subtotal = admissionFee + studentMonthlyFee;
    //   return {
    //     name: student.name,
    //     admissionFee,
    //     monthlyFee: studentMonthlyFee,
    //     subtotal,
    //   };
    // });
    // alternative one if only for the third child will get 10% discount
    // const feeDetails = approvedStudents.map((student, index) => {
    //   const baseAdmissionFee = 20;
    //   const isThirdOrLaterStudent = index >= 2;
    //   const studentAdmissionFee = isThirdOrLaterStudent
    //     ? baseAdmissionFee * 0.9
    //     : baseAdmissionFee;

    //   const monthlyFee = student.monthly_fee || 0;

    //   // Calculate pro-rated monthly fee if applicable
    //   const startDate = new Date(student.startingDate);
    //   const joinDate = startDate.getDate();
    //   let adjustedMonthlyFee = monthlyFee;

    //   if (family.feeChoice === "proRated" && joinDate > 10) {
    //     if (joinDate <= 20) {
    //       adjustedMonthlyFee = (2 / 3) * monthlyFee;
    //     } else {
    //       adjustedMonthlyFee = (1 / 3) * monthlyFee;
    //     }
    //   }

    //   const subtotal = studentAdmissionFee + adjustedMonthlyFee;

    //   return {
    //     name: student.name,
    //     admissionFee: studentAdmissionFee,
    //     monthlyFee: adjustedMonthlyFee,
    //     subtotal,
    //   };
    // });

    // const grandTotal = feeDetails.reduce((acc, cur) => acc + cur.subtotal, 0);

    const tableHTML = `
    <div class="table-responsive">
      <table class="table table-bordered" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #444; color: #fff;">
            <th style="padding: 6px; border: 1px solid #ccc;">Child Name</th>
            <th style="padding: 6px; border: 1px solid #ccc;">Admission Fee ($)</th>
            <th style="padding: 6px; border: 1px solid #ccc;">Monthly Fee ($)</th>
            <th style="padding: 6px; border: 1px solid #ccc;">Subtotal ($)</th>
          </tr>
        </thead>
        <tbody>
          ${feeDetails
            .map(
              (child) => `
            <tr>
              <td style="padding: 6px; border: 1px solid #ccc;">${
                child.name
              }</td>
              <td style="padding: 6px; border: 1px solid #ccc;">${child.admissionFee.toFixed(
                2
              )}</td>
              <td style="padding: 6px; border: 1px solid #ccc;">${child.monthlyFee.toFixed(
                2
              )}</td>
              <td style="padding: 6px; border: 1px solid #ccc;">${child.subtotal.toFixed(
                2
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div style="text-align: right; margin-top: 10px; font-weight: bold;">
        Grand Total: $${grandTotal.toFixed(2)}
      </div>
    </div>
  `;

    const result = await Swal.fire({
      title: `Confirm Payment via ${method}`,
      html: tableHTML,
      width: "60%",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: async () => {
        try {
          const paymentData = {
            familyId: approvedFamily?._id,
            name: user?.displayName,
            email: user?.email,
            amount: grandTotal,
            method,
            date: new Date().toISOString(),
            paymentType: "admissionOnHold",
            status: "pending",
            students: feeDetails?.map((student) => ({
              studentId: student.studentId,
              name: student.name,
              admissionFee: student.admissionFee,
              monthlyFee: student.monthlyFee,
              joiningMonth: student.joiningMonth,
              joiningYear: student.joiningYear,
            })),
          };
          const { data } = await axiosPublic.post("/fees", paymentData);

          if (data.insertedId) {
            toast.success("Payment successful!");
            refetch();
          }

          const updatePromises = approvedStudents.map((student) =>
            updateStudentStatus({ id: student._id, status: "hold" })
              .unwrap()
              .catch((err) => {
                console.error(`Update failed for ${student.name}`, err);
                return null;
              })
          );

          const results = await Promise.allSettled(updatePromises);
          const failed = results.filter((r) => r.status === "rejected");

          if (failed.length) {
            return Swal.fire(
              "Some updates failed. Please try again.",
              "",
              "error"
            );
          }
        } catch (err) {
          Swal.showValidationMessage(`Request failed: ${err.message}`);
          return false;
        }
      },
    });

    if (result.isConfirmed) {
      Swal.fire("Success!", "All students are marked as 'on hold'.", "success");
      refetch();
    }
  };
  // const paymentDetails =
  console.log(feeDetails);

  return (
    <div>
      <h3 className="fs-1 fw-bold text-center">
        Students Linked With this account
      </h3>
      <div className="table-responsive mb-3">
        <table className="table mb-0" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              {[
                "#",
                "Student Name",
                "Department",
                "Session",
                "Class",
                "Time",
                "Monthly Fee",
                "Status",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="font-danger text-white fw-bolder border h6 text-center align-middle"
                  style={{ backgroundColor: "var(--border2)" }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {family?.childrenDocs?.length > 0 ? (
              family.childrenDocs.map((student, idx) => (
                <tr key={student._id}>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {idx + 1}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {student.name}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {student.academic?.department}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {student.academic?.session}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {student.academic?.class || "Not Provided Yet"}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {sessionMap[student.academic?.time]
                      ? sessionMap[student.academic?.time]
                      : "not available"}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {student?.monthly_fee
                      ? student?.monthly_fee
                      : "Not Assigned"}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {student.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <h5>No students available.</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <AdmissionFeeModal
          familyId={approvedFamily?._id}
          showModal={showModal}
          handleClose={handleClose}
          paymentDetails={feeDetails}
          approvedFamily={approvedFamily}
          admissionFee={admissionFee}
          refetch={refetch}
        />
      </div>
      {approvedFamily?.childrenDocs?.length > 0 && (
        <>
          <h3 className="fs-1 fw-bold text-center pt-5">
            Action Required For Admission
          </h3>
          {approvedFamily?.childrenDocs?.length > 0 ? (
            <div className="row justify-content-center mt-3">
              <button
                onClick={handleShow}
                className="col-lg-2 text-white py-1 px-2 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Pay Now
              </button>
              <p className="col-lg-1 d-flex align-items-center justify-content-center">
                or
              </p>
              <button
                className="col-lg-2 text-white py-1 px-2 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
                onClick={() => handleOtherPayment("office payment")}
              >
                Pay in the office from the start day
              </button>
              <p className="col-lg-1 d-flex align-items-center justify-content-center">
                or
              </p>
              <button
                className="col-lg-2 text-white py-1 px-2 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
                onClick={() => handleOtherPayment("bank transfer")}
              >
                Pay With Bank <br />
                (within 7 days)
              </button>
              <p className="col-lg-1 d-flex align-items-center justify-content-center">
                or
              </p>
              <button
                className="col-lg-2 text-white py-1 px-2 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
                onClick={() => handleOtherPayment("cash or card machine")}
              >
                Pay With Cash / Card Machine <br />
                (within 7 days)
              </button>
            </div>
          ) : (
            <h3 className="text-danger">No Child is Approved</h3>
          )}
        </>
      )}
      {enrolledFamily?.childrenDocs?.length > 0 && (
        <MonthlyFeePayment enrolledFamily={enrolledFamily}></MonthlyFeePayment>
      )}

      {shouldShowModal && <FeeChoiceModal refetch={approvedRefetch} />}
    </div>
  );
}
