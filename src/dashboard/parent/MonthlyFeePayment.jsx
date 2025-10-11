import Swal from "sweetalert2";
import {
  useCreateFeeDataMutation,
  useGetFeesByIdQuery,
  useGetUnpaidFeesQuery,
} from "../../redux/features/fees/feesApi";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useState } from "react";
import MonthlyFeeModal from "../shared/MonthlyFeeModal";
import { FaEye } from "react-icons/fa6";
import ShowFeeDataModal from "../shared/ShowFeeDataModal";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import { useLocation } from "react-router";

export default function MonthlyFeePayment({ enrolledFamily }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [createFeeData] = useCreateFeeDataMutation();
  const { pathname } = useLocation();

  const { data: unpaidFees, isLoading } = useGetUnpaidFeesQuery(
    enrolledFamily?._id,
    {
      skip: !enrolledFamily?._id,
    }
  );
  const gradientStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };
  if (!enrolledFamily || enrolledFamily.childrenDocs.length === 0) {
    return <p>No enrolled students found.</p>;
  }

  const { user } = useAuth();

  const {
    data: fees = [],
    refetch,
    isLoading: isLoadingFee,
  } = useGetFeesByIdQuery(enrolledFamily?._id, {
    skip: !enrolledFamily?._id,
  });

  // FIX 1: Update student names extraction for new structure
  const getStudentNames = (fee) => {
    if (fee.students && Array.isArray(fee.students)) {
      return fee.students.map((student) => student.name).join(", ");
    }
    return fee.students || "N/A"; // fallback to old structure
  };

  // FIX 2: Update display month extraction for new structure
  const getDisplayMonth = (fee) => {
    // For new structure: get month from students[0].monthsPaid[0]
    if (
      fee.students &&
      fee.students.length > 0 &&
      fee.students[0].monthsPaid &&
      fee.students[0].monthsPaid.length > 0
    ) {
      const firstMonth = fee.students[0].monthsPaid[0];
      return `${firstMonth.month}/${firstMonth.year}`;
    }
    // For old structure
    return fee.displayMonth || "N/A";
  };

  // FIX 3: Update paid date extraction
  const getPaidDate = (fee) => {
    // For new structure: use timestamp.$date
    if (fee.timestamp?.$date) {
      return new Date(fee.timestamp.$date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    // For old structure
    return fee.paidDate
      ? new Date(fee.paidDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  };

  // FIX 4: Update fee ID handling for modal
  const handleDataShow = (feeId) => {
    setSelectedFeeId(feeId);
    setShowDataModal(true);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleDataClose = () => setShowDataModal(false);
  const handleClose = () => setShowModal(false);

  // Instead of state + getUnpaidFees util, directly use API response
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

  // FIX 5: Update payment data structure for new schema
  const handleOtherPayment = async (method) => {
    const tableHTML = `
    <div class="table-responsive">
      <table class="table table-bordered" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #444; color: #fff;">
            <th style="padding: 6px; border: 1px solid #ccc;">Student Name</th>
            <th style="padding: 6px; border: 1px solid #ccc;">Month</th>
            <th style="padding: 6px; border: 1px solid #ccc;">Discount</th>
            <th style="padding: 6px; border: 1px solid #ccc;">Total Amount (£)</th>
          </tr>
        </thead>
        <tbody>
          ${unpaidRows
            .map(
              (row) => `
            <tr>
              <td style="padding: 6px; border: 1px solid #ccc;">${
                row?.studentNames
              }</td>
              <td style="padding: 6px; border: 1px solid #ccc;">${
                row?.month
              }</td>
              <td style="padding: 6px; border: 1px solid #ccc;">${
                enrolledFamily?.discount ? enrolledFamily?.discount : 0
              }%</td>
              <td style="padding: 6px; border: 1px solid #ccc;">${
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
      width: "60%",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: async () => {
        try {
          // FIX 6: Update payment data to match new structure
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
                date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
              },
            ],
          };

          const data = await createFeeData(paymentData).unwrap();

          if (data.insertedId) {
            toast.success("Payment request submitted successfully!");
            refetch();
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
      refetch();
    }
  };

  if (isLoading || isLoadingFee) {
    return <LoadingSpinnerDash></LoadingSpinnerDash>;
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
                    {/* FIX 7: Use helper function for student names */}
                    <td>{getStudentNames(fee)}</td>

                    {/* FIX 8: Use helper function for display month */}
                    <td>{getDisplayMonth(fee)}</td>

                    {/* FIX 9: Use amount or expectedTotal */}
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

                    {/* FIX 10: Use helper function for paid date */}
                    <td>{getPaidDate(fee)}</td>

                    {/* FIX 11: Use _id instead of originalFeeIds */}
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
              onClick={() => handleOtherPayment("bank transfer")}
            >
              Bank Transfer
            </button>

            <p className="col-lg-1 d-flex align-items-center justify-content-center">
              or
            </p>
            <button
              className="col-lg-2 text-white py-1 px-2 rounded-2"
              style={{ backgroundColor: "var(--border2)" }}
              onClick={() => handleOtherPayment("cash payment at office")}
            >
              {" "}
              Cash Payment at Office
            </button>
            <p className="col-lg-1 d-flex align-items-center justify-content-center">
              or
            </p>
            <button
              className="col-lg-2 text-white py-1 px-2 rounded-2"
              style={{ backgroundColor: "var(--border2)" }}
              onClick={() => handleOtherPayment("card machine at office")}
            >
              Card Machine at Office
            </button>
          </div>
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
        refetch={refetch}
      />
    </div>
  );
}
