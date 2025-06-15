import Swal from "sweetalert2";
import { useGetFeesByIdQuery } from "../../redux/features/fees/feesApi";
import { getUnpaidFees } from "../../utils/getUnpaidFees";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import MonthlyFeeModal from "../shared/MonthlyFeeModal";
import { FaEye } from "react-icons/fa6";
import ShowFeeDataModal from "../shared/ShowFeeDataModal";

export default function MonthlyFeePayment({ enrolledFamily }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  if (!enrolledFamily || enrolledFamily.childrenDocs.length === 0) {
    return <p>No enrolled students found.</p>;
  }
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: fees = [], refetch } = useGetFeesByIdQuery(
    enrolledFamily?._id,
    {
      skip: !enrolledFamily?._id,
    }
  );

  const handleShow = (id) => {
    setShowModal(true);
  };
  const handleDataShow = (id) => {
    setSelectedFeeId(id);
    setShowDataModal(true);
  };

  const handleDataClose = () => setShowDataModal(false);
  const handleClose = () => setShowModal(false);
  const students = enrolledFamily?.childrenDocs;

  const [unpaidRows, setUnpaidRows] = useState([]);

  console.log(unpaidRows);

  useEffect(() => {
    if (students && fees) {
      const calculatedUnpaid = getUnpaidFees({
        students,
        fees,
        feeChoice: enrolledFamily?.feeChoice,
        discount: enrolledFamily?.discount,
      });
      setUnpaidRows(calculatedUnpaid);
    }
  }, [students, fees, enrolledFamily?.feeChoice, enrolledFamily?.discount]);

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
            <th style="padding: 6px; border: 1px solid #ccc;">Total Amount ($)</th>
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
          const { data } = await axiosPublic.post("/fees", paymentData);

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
      setUnpaidRows([]); // ⬅️ clear unpaid rows
      refetch();
    }
  };

  return (
    <div className="pt-5">
      <h3 className="fs-1 fw-bold text-center mb-4">Fee Summary</h3>

      {/* Paid History Table */}
      <h4 className="text-success">Paid Fee History</h4>
      <table className="table table-bordered table-hover mt-2">
        <thead className="table-light">
          <tr>
            <th>Students</th>
            <th>Type</th>
            <th>Month</th>
            <th>Amount(s)</th>
            <th>Status</th>
            <th>Paid Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fees?.map((fee) => (
            <tr key={fee._id}>
              <td>{fee.students?.map((s) => s.name).join(", ")}</td>
              <td className="text-capitalize">{fee.paymentType}</td>
              <td>{fee?.month || "_"}</td>
              <td>{fee?.amount}</td>
              <td>{fee.status}</td>
              <td>
                {fee.date
                  ? new Date(fee.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </td>
              <td>
                <button
                  className="py-1 px-2 rounded-2 border border-black"
                  // style={{ backgroundColor: "var(--border2)" }}
                  onClick={() => handleDataShow(fee?._id)}
                >
                  <FaEye></FaEye>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Unpaid Fee Table */}
      {unpaidRows.length > 0 && (
        <>
          <h4 className="text-danger mt-5">Pending Monthly Fees</h4>
          <table className="table table-bordered table-hover mt-2">
            <thead className="table-warning">
              <tr>
                <th>Student</th>

                <th>Month</th>
                <th>Discount</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unpaidRows.map((row, index) => (
                <tr
                  key={`unpaid-${row.studentId}-${row.month}-${index}`}
                  className="table-warning"
                >
                  <td>{row?.studentNames}</td>

                  <td>{row?.month}</td>
                  <td>
                    {enrolledFamily?.discount ? enrolledFamily?.discount : 0}%
                  </td>
                  <td>{row?.totalAmount}</td>
                  <td className="text-danger">Unpaid</td>
                  <td>
                    <button
                      // onClick={}
                      className="py-1 px-2 rounded-2 border border-black"
                      // style={{ backgroundColor: "var(--border2)" }}
                    >
                      <FaEye></FaEye>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {unpaidRows?.length > 0 && (
        <>
          {" "}
          <h3 className="fs-1 fw-bold text-center my-4">
            Action Required For Monthly Fee
          </h3>
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
              Pay in the office
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
