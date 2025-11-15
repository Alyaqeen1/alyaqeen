import React, { useState } from "react";
import AdmissionFeeModal from "../shared/AdmissionFeeModal";
import {
  useCancelFamilyDebitMutation,
  useGetApprovedFullFamilyQuery,
  useGetEnrolledFullFamilyQuery,
  useGetFamilyDebitQuery,
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
import StudentSummaryChart from "./StudentSummaryChart";
import ChildSection from "./ChildSection";
import { Link, useNavigate } from "react-router";
import { useGetDepartmentsQuery } from "../../redux/features/departments/departmentsApi";
import { useGetClassesQuery } from "../../redux/features/classes/classesApi";

export default function ParentDashboard({ family, refetch }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { user, loading } = useAuth();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const axiosPublic = useAxiosPublic();
  const [activeTab, setActiveTab] = useState(family?.childrenDocs[0]?._id);
  const navigate = useNavigate();

  const { data: departments } = useGetDepartmentsQuery();
  const { data: classes } = useGetClassesQuery();

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

  const {
    data: directDebitData,
    isLoading: directDebitLoading,
    refetch: refetchDirectDebit,
  } = useGetFamilyDebitQuery(enrolledFamily?._id, {
    skip: !enrolledFamily?._id,
  });
  const [cancelFamilyDebit, { isLoading: isCancelling }] =
    useCancelFamilyDebitMutation();

  // Helper function to get academic information for display
  const getAcademicDisplay = (academic) => {
    if (!academic) return { departments: [], classes: [], sessions: [] };

    // Handle new multi-department structure
    if (academic.enrollments && Array.isArray(academic.enrollments)) {
      const deptNames = academic.enrollments.map((enrollment) => {
        const dept = departments?.find((d) => d._id === enrollment.dept_id);
        return dept ? dept.dept_name : "Unknown Department";
      });

      const classNames = academic.enrollments.map((enrollment) => {
        const cls = classes?.find((c) => c._id === enrollment.class_id);
        return cls ? cls.class_name : "Unknown Class";
      });

      const sessionTimes = academic.enrollments.map(
        (enrollment) =>
          sessionMap[enrollment.session_time] ||
          enrollment.session_time ||
          "Not Set"
      );

      return {
        departments: [...new Set(deptNames)],
        classes: [...new Set(classNames)],
        sessions: [...new Set(sessionTimes)],
        count: academic.enrollments.length,
      };
    }

    // Handle old single department structure
    if (academic.dept_id) {
      const dept = departments?.find((d) => d._id === academic.dept_id);
      const cls = classes?.find((c) => c._id === academic.class_id);

      return {
        departments: [
          dept?.dept_name || academic.department || "Unknown Department",
        ],
        classes: [cls?.class_name || academic.class || "Unknown Class"],
        sessions: [sessionMap[academic.time] || academic.time || "Not Set"],
        count: 1,
      };
    }

    return {
      departments: [academic.department || "Not assigned"],
      classes: [academic.class || "Not assigned"],
      sessions: [sessionMap[academic.time] || academic.time || "Not Set"],
      count: 1,
    };
  };

  const approvedChildAfter10th = approvedFamily?.childrenDocs?.some((child) => {
    if (child.status !== "approved" || !child.startingDate) return false;
    const startDate = new Date(child.startingDate);
    // Check if joined after September 10th, 2025
    return startDate > new Date("2025-09-10");
  });
  const hasDirectDebitStatus = directDebitData?.directDebit?.status || null;
  const isPendingAuthorization =
    directDebitData?.directDebit?.mandateStatus === "pending" &&
    directDebitData?.directDebit?.status !== "cancelled";

  const shouldShowModal =
    roleData?.role === "parent" &&
    approvedChildAfter10th &&
    (approvedFamily?.feeChoice === null ||
      approvedFamily?.feeChoice === undefined);
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
    const joiningMonth = startDate.getMonth() + 1; // Now returns 1-12
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

    const tableHTML = `
    <div class="table-responsive" style="overflow-x: auto;">
      <table class="table table-bordered" style="width: 100%; border-collapse: collapse; min-width: 300px;">
        <thead>
          <tr style="background-color: #444; color: #fff;">
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Child Name</th>
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Admission Fee (£)</th>
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Monthly Fee (£)</th>
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Subtotal (£)</th>
          </tr>
        </thead>
        <tbody>
          ${feeDetails
            .map(
              (child) => `
            <tr>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${
                child.name
              }</td>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${child.admissionFee.toFixed(
                2
              )}</td>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${child.monthlyFee.toFixed(
                2
              )}</td>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${child.subtotal.toFixed(
                2
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div style="text-align: right; margin-top: 10px; font-weight: bold; white-space: nowrap;">
        Grand Total: £${grandTotal.toFixed(2)}
      </div>
    </div>
  `;

    const result = await Swal.fire({
      title: `Confirm Payment via ${method}`,
      html: `
      ${tableHTML}
      <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <label for="paymentDate" style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
          📅 Payment Date
        </label>
        <input 
          type="date" 
          id="paymentDate" 
          class="swal2-input" 
          value="${new Date().toISOString().split("T")[0]}"
          style="
          width: 80%;
            padding: 10px 12px; 
            border: 2px solid #ddd; 
            
            color: black;
            border-radius: 6px; 
            font-size: 14px;
            transition: border-color 0.3s;
          "
          onfocus="this.style.borderColor='#007bff'"
          onblur="this.style.borderColor='#ddd'"
          required
        />
        <small style="display: block; margin-top: 5px; color: #666; font-size: 12px;">
          Select the date when you made the payment
        </small>
      </div>
    `,
      width: "auto",
      maxWidth: "800px",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: async () => {
        try {
          const paymentDateInput = document.getElementById("paymentDate");
          const selectedDate = paymentDateInput.value;

          if (!selectedDate) {
            Swal.showValidationMessage("Please select a payment date");
            return false;
          }

          // ✅ CORRECTED: Include both admission fee and monthly fee in payments array
          const paymentData = {
            familyId: approvedFamily?._id,
            name: user?.displayName,
            email: user?.email,
            paymentType: "admissionOnHold",
            status: "pending",
            students: feeDetails?.map((student) => ({
              studentId: student.studentId,
              name: student.name,
              admissionFee: student.admissionFee,
              monthlyFee: student.monthlyFee,
              discountedFee: student.monthlyFee, // Same as monthlyFee for now
              joiningMonth: student.joiningMonth.toString().padStart(2, "0"),
              joiningYear: student.joiningYear,
              payments: [
                {
                  amount: student.admissionFee,
                  method: method,
                  date: selectedDate,
                },
                {
                  amount: student.monthlyFee, // ✅ ADDED: Monthly fee payment
                  method: method,
                  date: selectedDate,
                },
              ],
              subtotal: student.subtotal,
            })),
            expectedTotal: grandTotal,
            remaining: 0,
            payments: [
              {
                amount: grandTotal,
                method: method,
                date: selectedDate,
              },
            ],
            timestamp: new Date().toISOString(),
          };

          const { data } = await axiosPublic.post("/fees", paymentData);

          if (data.insertedId) {
            toast.success("Payment successful!");
            refetch();
          }

          // Update student statuses to "enrolled"
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
      Swal.fire("Success!", "All students are now enrolled.", "success");
      refetch();
    }
  };
  const handleManageDirectDebit = () => {
    navigate("/dashboard/parent/pay-by-direct-debit", {
      state: {
        manage: true,
        familyId: enrolledFamily?._id,
        fromFeesPage: true,
      },
    });
  };
  const handleCancelDirectDebit = async () => {
    const result = await Swal.fire({
      title: "Cancel Direct Debit?",
      text: "Are you sure you want to cancel your Direct Debit setup?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const result = await cancelFamilyDebit(enrolledFamily._id).unwrap();

        // ✅ RTK will automatically refetch getFamilyDebit due to invalidatesTags
        if (result?.success) {
          Swal.fire(
            "Cancelled!",
            "Your Direct Debit has been cancelled.",
            "success"
          );
          // Optional: Refetch to update UI immediately
          refetchDirectDebit();
        }
      } catch (error) {
        console.error("Cancellation failed:", error);
        Swal.fire("Error!", "Failed to cancel Direct Debit.", "error");
      }
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="d-flex justify-content-center my-5">
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {family?.childrenDocs?.map((student) => (
            <button
              key={student?._id}
              className="btn fw-semibold px-4 py-2 rounded-pill border-0 shadow-sm transition-all"
              style={{
                background:
                  activeTab === student?._id
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                color: activeTab === student?._id ? "white" : "#6c757d",
                border:
                  activeTab === student?._id ? "none" : "1px solid #dee2e6",
                minWidth: "120px",
                transition: "all 0.3s ease",
                transform:
                  activeTab === student?._id ? "scale(1.05)" : "scale(1)",
                boxShadow:
                  activeTab === student?._id
                    ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setActiveTab(student?._id)}
            >
              <div className="d-flex flex-column align-items-center">
                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                  {student.name.length > 5
                    ? student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : student.name}
                </span>
                {activeTab === student?._id && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>
            </button>
          ))}

          <button
            className="btn fw-semibold px-4 py-2 rounded-pill border-0 shadow-sm transition-all"
            style={{
              background:
                activeTab === "payment-summary"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              color: activeTab === "payment-summary" ? "white" : "#6c757d",
              border:
                activeTab === "payment-summary" ? "none" : "1px solid #dee2e6",
              minWidth: "160px",
              transition: "all 0.3s ease",
              transform:
                activeTab === "payment-summary" ? "scale(1.05)" : "scale(1)",
              boxShadow:
                activeTab === "payment-summary"
                  ? "0 4px 15px rgba(102, 126, 234, 0.4)"
                  : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => setActiveTab("payment-summary")}
          >
            <div className="d-flex flex-column align-items-center">
              <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                💰 Payment Summary
              </span>
              {activeTab === "payment-summary" && (
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    marginTop: "4px",
                  }}
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Tab content container */}
      <div className="tab-content mt-4">
        {activeTab === "payment-summary" && (
          <div>
            <h3 className="fs-2 fw-bold text-center">
              Students Linked With this account
            </h3>
            <div className="table-responsive mb-3">
              <table className="table mb-0" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    {[
                      "#",
                      "Student Name",
                      "Departments",
                      "Classes",
                      "Session Times",
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
                    family?.childrenDocs?.map((student, idx) => {
                      const academicInfo = getAcademicDisplay(student.academic);

                      return (
                        <tr key={student._id}>
                          <td className="border h6 text-center align-middle text-nowrap">
                            {idx + 1}
                          </td>
                          <td className="border h6 text-center align-middle text-nowrap">
                            {student.name}
                          </td>
                          <td className="border text-center align-middle">
                            <div className="d-flex flex-column gap-1">
                              {academicInfo.departments
                                .slice(0, 2)
                                .map((dept, deptIdx) => (
                                  <div key={deptIdx} className="small">
                                    {dept}
                                  </div>
                                ))}
                              {academicInfo.departments.length > 2 && (
                                <div className="small text-muted">
                                  +{academicInfo.departments.length - 2} more
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border text-center align-middle">
                            <div className="d-flex flex-column gap-1">
                              {academicInfo.classes
                                .slice(0, 2)
                                .map((cls, clsIdx) => (
                                  <div key={clsIdx} className="small">
                                    {cls}
                                  </div>
                                ))}
                              {academicInfo.classes.length > 2 && (
                                <div className="small text-muted">
                                  +{academicInfo.classes.length - 2} more
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border text-center align-middle">
                            <div className="d-flex flex-column gap-1">
                              {academicInfo.sessions
                                .slice(0, 2)
                                .map((session, sessionIdx) => (
                                  <div key={sessionIdx} className="small">
                                    {session}
                                  </div>
                                ))}
                              {academicInfo.sessions.length > 2 && (
                                <div className="small text-muted">
                                  +{academicInfo.sessions.length - 2} more
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border h6 text-center align-middle text-nowrap">
                            £
                            {student?.monthly_fee
                              ? student?.monthly_fee
                              : "Not Assigned"}
                          </td>
                          <td className="border h6 text-center align-middle text-nowrap">
                            {student.status}
                          </td>
                        </tr>
                      );
                    })
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
                {hasDirectDebitStatus === "active" ? (
                  // ✅ DIRECT DEBIT ACTIVE - Show only management options
                  <div className="row justify-content-center mt-3">
                    <div className="col-lg-8 text-center">
                      <div className="text-success py-3 px-4 rounded-3 border border-success bg-light mb-3">
                        <i className="fas fa-check-circle me-2 fs-4"></i>
                        <h5 className="d-inline">Direct Debit Active</h5>
                        <br />
                        <small className="text-muted">
                          Your Admission Fee and First Month Fee will be
                          automatically collected each month
                        </small>
                      </div>

                      <div className="d-flex justify-content-center gap-3">
                        <button
                          className="btn btn-outline-primary"
                          onClick={handleManageDirectDebit}
                        >
                          Manage Direct Debit
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={handleCancelDirectDebit}
                          disabled={isCancelling}
                        >
                          {isCancelling
                            ? "Cancelling..."
                            : "Cancel Direct Debit"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : isPendingAuthorization ? (
                  // ✅ PENDING AUTHORIZATION - Show pending status with redirect button
                  <div className="row justify-content-center mt-3">
                    <div className="col-lg-8 text-center">
                      <div className="text-warning py-3 px-4 rounded-3 border border-warning bg-light mb-3">
                        <i className="fas fa-clock me-2 fs-4"></i>
                        <h5 className="d-inline">
                          Direct Debit Pending Authorization
                        </h5>
                        <br />
                        <small className="text-muted">
                          Your bank is verifying the Direct Debit mandate. This
                          usually takes 2-3 business days.
                          <br />
                          Your payments will be automatic once authorized.
                        </small>
                      </div>

                      <div className="d-flex justify-content-center gap-3">
                        <button
                          className="btn btn-warning text-white"
                          onClick={() =>
                            navigate("/dashboard/parent/pay-by-direct-debit")
                          }
                        >
                          <i className="fas fa-external-link-alt me-2"></i>
                          Check Status & Details
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={handleCancelDirectDebit}
                          disabled={isCancelling}
                        >
                          {isCancelling ? "Cancelling..." : "Cancel Setup"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {approvedFamily?.childrenDocs?.length > 0 ? (
                      <div className="row justify-content-center mt-3">
                        <button
                          onClick={handleShow}
                          className="col-lg-2 text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                        >
                          Pay Now by Card
                        </button>

                        <p className="col-lg-1 d-flex align-items-center justify-content-center">
                          or
                        </p>
                        <button
                          className="col-lg-2 text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() =>
                            handleOtherPayment("cash payment at office")
                          }
                        >
                          Cash Payment at Office
                        </button>
                        <p className="col-lg-1 d-flex align-items-center justify-content-center">
                          or
                        </p>
                        <button
                          className="col-lg-2 text-white py-1 px-2 rounded-2"
                          style={{ backgroundColor: "var(--border2)" }}
                          onClick={() =>
                            handleOtherPayment("card machine at office")
                          }
                        >
                          Card Machine at Office
                        </button>

                        <p className="col-lg-1 d-flex align-items-center justify-content-center">
                          or
                        </p>
                        <Link
                          className="col-lg-2 text-white py-2 px-3 rounded-2 text-center"
                          style={{ backgroundColor: "var(--border2)" }}
                          to={"/dashboard/parent/pay-by-direct-debit"}
                        >
                          Pay by Direct Debit
                        </Link>
                      </div>
                    ) : (
                      <h3 className="text-danger">No Child is Approved</h3>
                    )}
                  </>
                )}
              </>
            )}
            {enrolledFamily?.childrenDocs?.length > 0 && (
              <MonthlyFeePayment
                enrolledFamily={enrolledFamily}
              ></MonthlyFeePayment>
            )}
          </div>
        )}

        {family?.childrenDocs?.map(
          (student) =>
            activeTab === student?._id && (
              <ChildSection
                key={student?._id}
                studentId={student?._id}
              ></ChildSection>
            )
        )}
      </div>

      {shouldShowModal && <FeeChoiceModal refetch={approvedRefetch} />}
    </div>
  );
}
