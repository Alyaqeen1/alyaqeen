import Swal from "sweetalert2";
import {
  useCreateFeeDataMutation,
  useGetFeesByIdQuery,
  useGetUnpaidFeesQuery,
} from "../../redux/features/fees/feesApi";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import MonthlyFeeModal from "../shared/MonthlyFeeModal";
import { FaEye } from "react-icons/fa6";
import ShowFeeDataModal from "../shared/ShowFeeDataModal";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { Link, useLocation, useNavigate } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import {
  useCancelFamilyDebitMutation,
  useGetFamilyDebitQuery,
} from "../../redux/features/families/familiesApi";

export default function MonthlyFeePayment({ enrolledFamily }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [createFeeData] = useCreateFeeDataMutation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // ✅ RTK Queries - Use data directly from RTK
  const {
    data: directDebitData,
    isLoading: directDebitLoading,
    refetch: refetchDirectDebit,
  } = useGetFamilyDebitQuery(enrolledFamily?._id, {
    skip: !enrolledFamily?._id,
  });

  const [cancelFamilyDebit, { isLoading: isCancelling }] =
    useCancelFamilyDebitMutation();

  const { data: unpaidFees, isLoading: unpaidLoading } = useGetUnpaidFeesQuery(
    enrolledFamily?._id,
    {
      skip: !enrolledFamily?._id,
    }
  );

  const {
    data: fees = [],
    refetch: refetchFees,
    isLoading: feesLoading,
  } = useGetFeesByIdQuery(enrolledFamily?._id, {
    skip: !enrolledFamily?._id,
  });

  // ✅ Use data directly from RTK queries
  const hasDirectDebit = directDebitData?.hasDirectDebit || false;
  const hasDirectDebitStatus = directDebitData?.directDebit?.status || null;
  const paymentMethod = directDebitData?.directDebit || null;

  // ✅ Proper pending authorization check
  const isPendingAuthorization =
    directDebitData?.directDebit?.mandateStatus === "pending" &&
    directDebitData?.directDebit?.status !== "cancelled";

  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  if (!enrolledFamily || enrolledFamily.childrenDocs.length === 0) {
    return <p>No enrolled students found.</p>;
  }

  const { user } = useAuth();

  // ✅ CANCEL DIRECT DEBIT FUNCTION
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

  // ✅ MANAGE DIRECT DEBIT FUNCTION
  const handleManageDirectDebit = () => {
    navigate("/dashboard/parent/pay-by-direct-debit", {
      state: {
        manage: true,
        familyId: enrolledFamily?._id,
        fromFeesPage: true,
      },
    });
  };

  // ✅ CHECK STATUS FUNCTION - Redirects to Direct Debit page
  const handleCheckStatus = () => {
    navigate("/dashboard/parent/pay-by-direct-debit", {
      state: {
        familyId: enrolledFamily?._id,
        fromFeesPage: true,
      },
    });
  };

  // Rest of your existing functions remain the same...
  const getStudentNames = (fee) => {
    if (fee.students && Array.isArray(fee.students)) {
      return fee.students.map((student) => student.name).join(", ");
    }
    return fee.students || "N/A";
  };

  const getDisplayMonth = (fee) => {
    if (
      fee.students &&
      fee.students.length > 0 &&
      fee.students[0].monthsPaid &&
      fee.students[0].monthsPaid.length > 0
    ) {
      const firstMonth = fee.students[0].monthsPaid[0];
      return `${firstMonth.month}/${firstMonth.year}`;
    }
    return fee.displayMonth || "N/A";
  };

  const getPaidDate = (fee) => {
    if (fee.timestamp?.$date) {
      return new Date(fee.timestamp.$date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return fee.paidDate
      ? new Date(fee.paidDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  };

  const handleDataShow = (feeId) => {
    setSelectedFeeId(feeId);
    setShowDataModal(true);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleDataClose = () => setShowDataModal(false);
  const handleClose = () => setShowModal(false);

  const unpaidRows = unpaidFees?.unpaidMonths || [];

  const studentMap = {};

  unpaidRows.forEach((row) => {
    const [yearStr, monthStr] = row.month.split("-");
    const year = parseInt(yearStr);
    const month = monthStr;

    row.students.forEach((stu) => {
      const { studentId, name, monthsUnpaid, subtotal } = stu;

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          studentId,
          name,
          monthsPaid: [],
          subtotal: 0,
        };
      }

      monthsUnpaid.forEach(({ monthlyFee, discountedFee }) => {
        studentMap[studentId].monthsPaid.push({
          month,
          year,
          monthlyFee,
          discountedFee,
          paid: discountedFee,
        });
      });

      studentMap[studentId].subtotal += subtotal || 0;
    });
  });

  const feeStudents = Object.values(studentMap).map((stu) => ({
    ...stu,
    subtotal: parseFloat(stu.subtotal.toFixed(2)),
  }));

  console.log(feeStudents);
  const grandTotal = unpaidRows.reduce((acc, row) => acc + row.totalAmount, 0);

  const handleOtherPayment = async (method) => {
    const tableHTML = `
    <div class="table-responsive" style="overflow-x: auto;">
      <table class="table table-bordered" style="width: 100%; border-collapse: collapse; min-width: 300px;">
        <thead>
          <tr style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Student Name</th>
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Month</th>
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Discount</th>
            <th style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">Total Amount (£)</th>
          </tr>
        </thead>
        <tbody>
          ${unpaidRows
            .map(
              (row) => `
            <tr>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${
                row?.studentNames
              }</td>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${
                row?.month
              }</td>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${
                enrolledFamily?.discount ? enrolledFamily?.discount : 0
              }%</td>
              <td style="padding: 8px 4px; border: 1px solid #ccc; white-space: nowrap;">${
                row?.totalAmount
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div style="text-align: right; margin-top: 10px; font-weight: bold;">
        Grand Total: £${grandTotal.toFixed(2)}
      </div>
    </div>
  `;

    const result = await Swal.fire({
      title: `Confirm Payment via ${method}`,
      html: tableHTML,
      width: "auto",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: async () => {
        try {
          const paymentData = {
            familyId: enrolledFamily?._id,
            name: user?.displayName,
            email: user?.email,
            paymentType: "monthlyOnHold",
            status: "pending",
            students: feeStudents,
            expectedTotal: grandTotal,
            remaining: 0,
            payments: [
              {
                amount: grandTotal,
                method: method,
                date: new Date().toISOString().split("T")[0],
              },
            ],
          };

          const data = await createFeeData(paymentData).unwrap();

          if (data.insertedId) {
            toast.success("Payment request submitted successfully!");
            refetchFees();
          }
        } catch (err) {
          Swal.showValidationMessage(`Request failed: ${err.message}`);
          return false;
        }
      },
    });

    if (result.isConfirmed) {
      Swal.fire(
        "Success!",
        "Your Payment was successful. Please wait for admin review.",
        "success"
      );
      refetchFees();
    }
  };

  if (unpaidLoading || feesLoading || directDebitLoading) {
    return <LoadingSpinnerDash />;
  }

  return (
    <div className="pt-5">
      <h3 className="fs-2 fw-bold text-center">
        {pathname === "/dashboard/parent/pay-monthly-fees"
          ? "Pay Monthly Fees"
          : "Fee Summary"}
      </h3>

      {/* Paid History Table */}
      {fees?.length > 0 && pathname === "/dashboard" && (
        <>
          <h4 className="text-success">Paid Fee History</h4>
          <div className="table-responsive mb-3">
            <table
              className="table mb-0 table-bordered"
              style={{
                minWidth: 700,
              }}
            >
              <thead className="table-light">
                <tr>
                  <th>Students</th>
                  <th>Month</th>
                  <th>Amount(s)</th>
                  <th>Status</th>
                  <th>Paid Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fees?.map((fee, index) => (
                  <tr key={fee._id || `${fee.displayMonth}-${index}`}>
                    <td>{getStudentNames(fee)}</td>
                    <td>{getDisplayMonth(fee)}</td>
                    <td>£{fee.amount || fee.expectedTotal}</td>
                    <td>
                      <span
                        className={`py-1 px-2 rounded-3 text-white ${
                          fee.status === "paid"
                            ? "bg-success"
                            : fee.status === "pending"
                            ? "bg-warning"
                            : "bg-info"
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td>{getPaidDate(fee)}</td>
                    <td>
                      <button
                        className="py-1 px-2 rounded-2 border border-black"
                        onClick={() => handleDataShow(fee._id)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Rest of your component remains the same */}
      {unpaidRows.length > 0 && (
        <>
          <h4 className="text-danger mt-5">Pending Monthly Fees</h4>
          <div className="table-responsive mb-3">
            <table
              className="table mb-0 table-bordered table-hover"
              style={{ minWidth: 700 }}
            >
              <thead className="table-warning">
                <tr>
                  <th>Students</th>
                  <th>Month</th>
                  <th>Discount</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {unpaidRows.map((row, index) => (
                  <tr
                    key={`unpaid-${row.month}-${index}`}
                    className="table-warning"
                  >
                    <td>{row.studentNames}</td>
                    <td>
                      {new Date(row.month + "-01").toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {enrolledFamily?.discount ? enrolledFamily.discount : 0}%
                    </td>
                    <td>£{row.totalAmount}</td>
                    <td className="text-danger">Unpaid</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!unpaidRows.length &&
        pathname === "/dashboard/parent/pay-monthly-fees" && (
          <>
            <div style={gradientStyle} className="text-white p-4 rounded-5">
              <div className="d-flex align-items-center flex-wrap gap-4">
                No Unpaid Months Available Now, Come Back Later
              </div>
            </div>
          </>
        )}

      {unpaidRows?.length > 0 && (
        <>
          <h3 className="fs-1 fw-bold text-center my-4">
            Action Required For Monthly Fee
          </h3>

          {/* ✅ CONDITIONAL RENDERING: Show appropriate UI based on Direct Debit status */}
          {hasDirectDebitStatus === "active" ? (
            // ✅ DIRECT DEBIT ACTIVE - Show only management options
            <div className="row justify-content-center mt-3">
              <div className="col-lg-8 text-center">
                <div className="text-success py-3 px-4 rounded-3 border border-success bg-light mb-3">
                  <i className="fas fa-check-circle me-2 fs-4"></i>
                  <h5 className="d-inline">Direct Debit Active</h5>
                  <br />
                  <small className="text-muted">
                    Your fees will be automatically collected each month
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
                    {isCancelling ? "Cancelling..." : "Cancel Direct Debit"}
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
                    onClick={handleCheckStatus}
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
            // ✅ DIRECT DEBIT NOT ACTIVE - Show all payment options
            <div className="row justify-content-center mt-3">
              <button
                onClick={handleShow}
                className="col-lg-2 text-white py-2 px-3 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Pay Now by Card
              </button>
              <p className="col-lg-1 d-flex align-items-center justify-content-center">
                or
              </p>
              <button
                className="col-lg-2 text-white py-2 px-3 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
                onClick={() => handleOtherPayment("bank transfer")}
              >
                Bank Transfer
              </button>

              <p className="col-lg-1 d-flex align-items-center justify-content-center">
                or
              </p>
              <button
                className="col-lg-2 text-white py-2 px-3 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
                onClick={() => handleOtherPayment("cash payment at office")}
              >
                Cash Payment at Office
              </button>
              <p className="col-lg-1 d-flex align-items-center justify-content-center">
                or
              </p>
              <button
                className="col-lg-2 text-white py-2 px-3 rounded-2"
                style={{ backgroundColor: "var(--border2)" }}
                onClick={() => handleOtherPayment("card machine at office")}
              >
                Card Machine at Office
              </button>
            </div>
          )}
        </>
      )}

      <ShowFeeDataModal
        feeId={selectedFeeId}
        showModal={showDataModal}
        handleClose={handleDataClose}
      ></ShowFeeDataModal>
      <MonthlyFeeModal
        familyId={enrolledFamily?._id}
        showModal={showModal}
        handleClose={handleClose}
        paymentDetails={feeStudents}
        unpaidRows={unpaidRows}
        enrolledFamily={enrolledFamily}
        refetch={refetchFees}
      />
    </div>
  );
}
