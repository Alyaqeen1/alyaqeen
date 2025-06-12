import React, { useState } from "react";
import AdmissionFeeModal from "../shared/AdmissionFeeModal";
import { useGetApprovedFullFamilyQuery } from "../../redux/features/families/familiesApi";
import useAuth from "../../hooks/useAuth";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import { useUpdateStudentStatusMutation } from "../../redux/features/students/studentsApi";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

export default function ParentDashboard({ family, refetch }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { user, loading } = useAuth();
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const axiosPublic = useAxiosPublic();
  const { data: approvedFamily, isLoading } = useGetApprovedFullFamilyQuery(
    user?.email,
    {
      skip: loading || !user?.email,
    }
  );

  const handleShow = (id) => {
    setSelectedStudentId(id);
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

  if (isLoading || loading) {
    return <LoadingSpinnerDash />;
  }

  const handleOtherPayment = async (method) => {
    const approvedStudents = approvedFamily?.childrenDocs?.filter(
      (student) => student.status === "approved"
    );

    if (!approvedStudents || approvedStudents.length === 0) {
      return Swal.fire("No approved students to process", "", "info");
    }

    const baseAdmissionFee = 20;
    const discount = approvedStudents.length > 2 ? 0.1 : 0;
    const admissionFee = baseAdmissionFee - baseAdmissionFee * discount;
    const monthlyFee = 50;

    const feeDetails = approvedStudents.map((student) => {
      const subtotal = admissionFee + monthlyFee;
      return {
        name: student.name,
        admissionFee,
        monthlyFee,
        subtotal,
      };
    });

    const grandTotal = feeDetails.reduce((acc, cur) => acc + cur.subtotal, 0);

    const tableHTML = `
      <div class="table-responsive">
        <table class="table table-bordered table-responsive" style="width: 100%; border-collapse: collapse;">
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
            paymentType: "admissionOnHold", // add this for backend records if needed
          };
          const { data } = await axiosPublic.post("/fees", paymentData);
          // ✅ 1. Save payment and show toast
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

  return (
    <div>
      <h3 className="fs-1 fw-bold text-center pt-5">
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
                    {student.academic?.time}
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
          uid={selectedStudentId}
          showModal={showModal}
          handleClose={handleClose}
          childrenDocs={approvedFamily?.childrenDocs}
          admissionFee={admissionFee}
          refetch={refetch}
        />
      </div>

      <h3 className="fs-1 fw-bold text-center pt-5">Action Required</h3>
      {approvedFamily?.childrenDocs?.length > 0 ? (
        <div className="row justify-content-center mt-3">
          <button
            onClick={() => handleShow(approvedFamily?._id)}
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
    </div>
  );
}
