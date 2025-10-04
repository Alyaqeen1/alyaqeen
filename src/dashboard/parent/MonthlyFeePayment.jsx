import Swal from "sweetalert2";
import {
  useCreateFeeDataMutation,
  useGetFeesByIdQuery,
  useGetUnpaidFeesQuery,
} from "../../redux/features/fees/feesApi";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import MonthlyFeeModal from "../shared/MonthlyFeeModal";
import { FaEye } from "react-icons/fa6";
import ShowFeeDataModal from "../shared/ShowFeeDataModal";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";

export default function MonthlyFeePayment({ enrolledFamily }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [createFeeData] = useCreateFeeDataMutation();
  const { data: unpaidFees, isLoading } = useGetUnpaidFeesQuery(
    enrolledFamily?._id,
    {
      skip: !enrolledFamily?._id,
    }
  );

  if (!enrolledFamily || enrolledFamily.childrenDocs.length === 0) {
    return <p>No enrolled students found.</p>;
  }

  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const {
    data: fees = [],
    refetch,
    isLoading: isLoadingFee,
  } = useGetFeesByIdQuery(enrolledFamily?._id, {
    skip: !enrolledFamily?._id,
  });

  console.log("📋 Fees data from backend:", fees);

  // ✅ Update total paid calculation for new data structure
  const totalPaid = fees?.reduce((acc, fee) => acc + (fee.amount || 0), 0);

  const handleShow = (id) => {
    setShowModal(true);
  };

  const handleDataShow = (feeIds) => {
    // Use the first fee ID for the modal, or all if needed
    setSelectedFeeId(feeIds[0]);
    setShowDataModal(true);
  };

  const handleDataClose = () => setShowDataModal(false);
  const handleClose = () => setShowModal(false);
  const students = enrolledFamily?.childrenDocs;

  // const [unpaidRows, setUnpaidRows] = useState([]);

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
        });
      });

      studentMap[studentId].subtotal += subtotal || 0;
    });
  });

  const feeStudents = Object.values(studentMap).map((stu) => ({
    ...stu,
    subtotal: parseFloat(stu.subtotal.toFixed(2)),
  }));

  const grandTotal = unpaidRows.reduce((acc, row) => acc + row.totalAmount, 0);

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
              }
              </td>
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
          const paymentData = {
            familyId: enrolledFamily?._id,
            name: user?.displayName,
            email: user?.email,
            amount: grandTotal,
            method,
            date: new Date().toISOString(),
            paymentType: "monthlyOnHold",
            status: "pending",
            students: feeStudents,
          };
          const data = await createFeeData(paymentData).unwrap();

          if (data.insertedId) {
            toast.success("Payment successful!");
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
      <h3 className="fs-2 fw-bold text-center">Fee Summary</h3>

      {/* Paid History Table */}
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
              <tr key={`${fee.displayMonth}-${index}`}>
                {/* ✅ Students column - shows all students who paid in this month */}
                <td>{fee.students}</td>

                {/* ✅ Month column - already formatted from backend */}
                <td>{fee.displayMonth}</td>

                {/* ✅ Amount column - total for all students in this month */}
                <td>£{fee.amount}</td>

                {/* ✅ Status column */}
                <td>
                  <span
                    className={`py-1 px-2 rounded-3 text-white ${
                      fee.status === "paid"
                        ? "bg-success"
                        : fee.status === "pending"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {fee.status}
                  </span>
                </td>

                {/* ✅ Paid Date column */}
                <td>
                  {fee.paidDate
                    ? new Date(fee.paidDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>

                {/* ✅ Action column - use the first fee ID for the modal */}
                <td>
                  <button
                    className="py-1 px-2 rounded-2 border border-black"
                    onClick={() => handleDataShow(fee.originalFeeIds)}
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
                  <th>Student</th>
                  <th>Month</th>
                  <th>Discount</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {unpaidRows.map((row, index) =>
                  row.students.map((stu, sIndex) =>
                    stu.monthsUnpaid.map((m, mIndex) => (
                      <tr
                        key={`unpaid-${stu.studentId}-${m.month}-${index}-${sIndex}-${mIndex}`}
                        className="table-warning"
                      >
                        <td>{stu.name}</td>
                        <td>{m.month}</td>
                        <td>
                          {enrolledFamily?.discount
                            ? enrolledFamily.discount
                            : 0}
                          %
                        </td>
                        <td>£{m.discountedFee}</td>
                        <td className="text-danger">Unpaid</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
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
              Pay by Bank Transfer (Account-to-Account Transfer)
            </button>

            <p className="col-lg-1 d-flex align-items-center justify-content-center">
              or
            </p>
            <button
              className="col-lg-2 text-white py-1 px-2 rounded-2"
              style={{ backgroundColor: "var(--border2)" }}
              onClick={() => handleOtherPayment("office payment")}
            >
              Set up a Standing Order or Direct Debit
            </button>
            <p className="col-lg-1 d-flex align-items-center justify-content-center">
              or
            </p>
            <button
              className="col-lg-2 text-white py-1 px-2 rounded-2"
              style={{ backgroundColor: "var(--border2)" }}
              onClick={() => handleOtherPayment("cash or card machine")}
            >
              Pay in Office by Card Machine or Cash
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
