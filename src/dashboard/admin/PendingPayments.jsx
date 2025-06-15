import React, { useState } from "react";
import { FaCheck, FaEye } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import {
  useGetStudentsByStatusQuery,
  useUpdateStudentStatusMutation,
} from "../../redux/features/students/studentsApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import { useGetHoldFullFamilyQuery } from "../../redux/features/families/familiesApi";
import { useGetFeesByStatusQuery } from "../../redux/features/fees/feesApi";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import ShowFeeDataModal from "../shared/ShowFeeDataModal";

export default function PendingPayments() {
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateStudentStatus] = useUpdateStudentStatusMutation();
  const {
    data: fees,
    isLoading: isFeeLoading,
    refetch,
  } = useGetFeesByStatusQuery("pending");
  const axiosPublic = useAxiosPublic();

  console.log(fees);
  const handleShow = (id) => {
    setSelectedFeeId(id);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  // const {
  //   data: students,
  //   isLoading,
  //   isError,
  //   refetch,
  // } = useGetStudentsByStatusQuery("hold");

  if (isFeeLoading) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
  }

  const handleStatus = async (students, newStatus, feeId, paymentType) => {
    try {
      if (paymentType === "admissionOnHold") {
        const updatePromises = students.map((student) =>
          updateStudentStatus({ id: student.studentId, status: newStatus })
            .unwrap()
            .catch((err) => {
              console.error(`Failed to update ${student.name}`, err);
              return null;
            })
        );
        await Promise.allSettled(updatePromises);

        if (newStatus === "enrolled") {
          await axiosPublic.patch(`/fees/update-status-mode/${feeId}`, {
            status: "paid",
            paymentType: "admission",
          });
          Swal.fire({
            icon: "success",
            title: "Students Enrolled and Payment Approved",
            timer: 1500,
            showConfirmButton: false,
          });
        } else if (newStatus === "approved") {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this! Student Status will again be approved and the student would need to pay again through dashboard",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              axiosPublic
                .patch(`/fees/update-status-mode/${feeId}`, {
                  status: "rejected",
                  paymentType: "admission",
                })
                .then((res) => {
                  if (res?.data?.modifiedCount) {
                    Swal.fire({
                      title: "Deleted!",
                      text: "Admission Declined & Fee Entry Rejected",
                      icon: "success",
                    });
                    refetch();
                  } else {
                    Swal.fire({
                      title: "Error",
                      text: "Something went wrong.",
                      icon: "error",
                    });
                  }
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error",
                    text:
                      error.response?.data?.message ||
                      "Failed to delete student.",
                    icon: "error",
                  });
                });
            }
          });
        }
        refetch();
      }

      // ✅ For monthlyOnHold payments
      else if (paymentType === "monthlyOnHold") {
        if (newStatus === "enrolled") {
          await axiosPublic.patch(`/fees/update-status-mode/${feeId}`, {
            status: "paid",
            paymentType: "monthly",
          });
          Swal.fire({
            icon: "success",
            title: "Monthly Payment Approved",
            timer: 1500,
            showConfirmButton: false,
          });
        } else if (newStatus === "approved") {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this! Students this monthly fee will be rejected",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              axiosPublic
                .patch(`/fees/update-status-mode/${feeId}`, {
                  status: "rejected",
                  paymentType: "monthly",
                })
                .then((res) => {
                  if (res?.data?.modifiedCount) {
                    Swal.fire({
                      title: "Deleted!",
                      text: "Monthly Fee Declined & Fee Entry Rejected",
                      icon: "success",
                    });
                    refetch();
                  } else {
                    Swal.fire({
                      title: "Error",
                      text: "Something went wrong.",
                      icon: "error",
                    });
                  }
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error",
                    text:
                      error.response?.data?.message ||
                      "Failed to delete student.",
                    icon: "error",
                  });
                });
            }
          });
        }
        refetch();
      }

      // For other types (fallback)
      else {
        Swal.fire({
          icon: "success",
          title: `Student status updated to ${newStatus}`,
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (err) {
      console.error("Error handling status:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <div>
      <div className="table-responsive mb-3">
        <table
          className="table mb-0"
          style={{
            minWidth: 700,
          }}
        >
          <thead>
            <tr>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                #
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Family Name
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Students
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Email
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Payment Method
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Payment Type
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Payment Date
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Total Amount
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Status
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {fees?.length > 0 ? (
              fees?.map((fee, idx) => (
                <tr key={fee?._id}>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {fee?.name}
                  </td>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {fee?.students?.map((child) => (
                      <span key={child?.studentId}>
                        {child?.name}
                        <br />
                      </span>
                    ))}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {fee?.email}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {fee?.method}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {fee?.paymentType}
                  </td>
                  <td className="border h6 text-center align-middle text-nowrap">
                    {fee?.date
                      ? new Date(fee.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", // or "long"
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>

                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {fee?.amount}
                  </td>
                  <td
                    className={`border h6 text-center align-middle text-nowrap`}
                  >
                    {fee?.status}
                  </td>
                  <td className="border h6 text-center text-nowrap align-middle">
                    <div className="d-flex flex-row gap-2 justify-content-center align-items-center h-100">
                      <button
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                        onClick={() => handleShow(fee?._id)}

                        // onClick={() =>
                        //   handleStatus(
                        //     fee?.students,
                        //     "enrolled",
                        //     fee?._id,
                        //     fee?.paymentType
                        //   )
                        // }
                      >
                        <FaEye></FaEye>
                      </button>
                      <button
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                        onClick={() =>
                          handleStatus(
                            fee?.students,
                            "enrolled",
                            fee?._id,
                            fee?.paymentType
                          )
                        }
                      >
                        <FaCheck></FaCheck>
                      </button>
                      <button
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                        onClick={() =>
                          handleStatus(
                            fee?.students,
                            "approved",
                            fee?._id,
                            fee?.paymentType
                          )
                        }
                      >
                        <ImCross />
                      </button>
                    </div>
                  </td>
                  {/* <td
                    className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                  >
                    <button
                      className="text-white py-1 px-2 rounded-2"
                      style={{ backgroundColor: "var(--border2)" }}
                      onClick={() => handleStatus(fee?._id, "enrolled")}
                    >
                      <FaCheck></FaCheck>
                    </button>
                    <button
                      className="text-white py-1 px-2 rounded-2"
                      style={{ backgroundColor: "var(--border2)" }}
                      onClick={() => handleStatus(fee?._id, "approved")}
                    >
                      <ImCross />
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12}>
                  <h5>No students available.</h5>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ShowFeeDataModal
          feeId={selectedFeeId}
          showModal={showModal}
          handleClose={handleClose}
        ></ShowFeeDataModal>
      </div>
    </div>
  );
}
