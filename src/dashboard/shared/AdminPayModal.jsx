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

export default function AdminPayModal({
  familyId,
  handleAdminClose,
  adminShowModal,
  refetch: familiesRefetch,
  refetchFee,
}) {
  const [unpaidRows, setUnpaidRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [createFeeData] = useCreateFeeDataMutation();

  const { data: enrolledFamily } = useGetEnrolledFullFamilyByIdQuery(familyId);
  const { data: fees = [] } = useGetFeesByIdQuery(enrolledFamily?._id);
  const { data: family } = useGetFamilyQuery(familyId);

  // const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (enrolledFamily && fees) {
      const calculatedUnpaid = getUnpaidFees({
        students: enrolledFamily.childrenDocs,
        fees,
        feeChoice: enrolledFamily.feeChoice,
        discount: enrolledFamily.discount,
      });
      setUnpaidRows(
        calculatedUnpaid.map((row) => ({ ...row, selected: false }))
      );
    }
  }, [
    enrolledFamily,
    fees,
    enrolledFamily?.childrenDocs,
    enrolledFamily?.feeChoice,
    enrolledFamily?.discount,
  ]);

  useEffect(() => {
    const total = selectedRows.reduce((sum, row) => sum + row.totalAmount, 0);
    setGrandTotal(total);
  }, [selectedRows]);

  const toggleMonthExpand = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const handleRowSelect = (row) => {
    setSelectedRows((prev) => {
      const isSelected = prev.some((r) => r.month === row.month);
      return isSelected
        ? prev.filter((r) => r.month !== row.month)
        : [...prev, row];
    });

    // Update the unpaidRows selection state
    setUnpaidRows((prev) =>
      prev.map((r) =>
        r.month === row.month ? { ...r, selected: !r.selected } : r
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRows.length === 0) {
      toast.error("Please select at least one month to pay");
      return;
    }

    // Get current date in ISO format
    const paymentDate = new Date().toISOString();

    const paymentData = {
      familyId,
      name: family.name,
      email: family.email,
      amount: grandTotal,
      status: "paid", // or "pending" based on your payment method
      date: paymentDate,
      method: "office payment", // or "instant" for online payments
      paymentType: "monthly",
      students: enrolledFamily.childrenDocs.map((student) => {
        // Find all selected months for this student
        const monthsPaid = selectedRows.flatMap((row) => {
          const studentUnpaid = row.students.find(
            (s) => s.studentId === student._id
          );
          if (!studentUnpaid) return [];

          return {
            month: studentUnpaid.monthsUnpaid[0].month.split("-")[1], // "08"
            year: parseInt(studentUnpaid.monthsUnpaid[0].month.split("-")[0]), // 2025
            monthlyFee: studentUnpaid.monthsUnpaid[0].monthlyFee,
            discountedFee: studentUnpaid.monthsUnpaid[0].discountedFee,
          };
        });

        return {
          studentId: student._id,
          name: student.name,
          monthsPaid,
          subtotal: monthsPaid.reduce(
            (sum, payment) => sum + payment.discountedFee,
            0
          ),
        };
      }),
    };

    try {
      // const { data } = await axiosPublic.post("/fees", paymentData);
      const data = await createFeeData(paymentData).unwrap();
      if (data.insertedId) {
        toast.success(
          `Payment of $${grandTotal.toFixed(2)} recorded successfully`
        );
        familiesRefetch();
        refetchFee();
        handleAdminClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment recording failed");
    }
  };

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

            <div className="modal-body p-4">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40px" }}></th>
                      <th>Month</th>
                      <th>Students</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th style={{ width: "50px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidRows.map((row) => (
                      <React.Fragment key={row.month}>
                        {/* Month Summary Row */}
                        <tr
                          className={
                            row.selected ? "table-primary" : "table-light"
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={row.selected || false}
                              onChange={() => handleRowSelect(row)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td onClick={() => toggleMonthExpand(row.month)}>
                            <strong>{row.month}</strong>
                          </td>
                          <td onClick={() => toggleMonthExpand(row.month)}>
                            {row.studentNames}
                          </td>
                          <td onClick={() => toggleMonthExpand(row.month)}>
                            ${row.totalAmount.toFixed(2)}
                          </td>
                          <td
                            className="text-danger"
                            onClick={() => toggleMonthExpand(row.month)}
                          >
                            Unpaid
                          </td>
                          <td
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMonthExpand(row.month);
                            }}
                          >
                            {expandedMonths[row.month] ? (
                              <FaChevronUp className="text-muted" />
                            ) : (
                              <FaChevronDown className="text-muted" />
                            )}
                          </td>
                        </tr>

                        {/* Expanded Student Details */}
                        {expandedMonths[row.month] &&
                          row.students.map((student) => (
                            <tr
                              key={`${row.month}-${student.studentId}`}
                              className="bg-white"
                            >
                              <td></td>
                              <td></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="ms-3">{student.name}</span>
                                </div>
                              </td>
                              <td>
                                $
                                {student.monthsUnpaid[0].discountedFee.toFixed(
                                  2
                                )}
                                <small className="text-muted ms-2">
                                  (Original: $
                                  {student.monthsUnpaid[0].monthlyFee.toFixed(
                                    2
                                  )}
                                  )
                                </small>
                              </td>
                              <td className="text-danger">Unpaid</td>
                              <td></td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Payment Summary</h5>
                    <ul className="list-group">
                      {selectedRows.map((row) => (
                        <li
                          key={row.month}
                          className="list-group-item d-flex justify-content-between"
                        >
                          <span>{row.month}</span>
                          <span>£{row.totalAmount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6 d-flex flex-column justify-content-end">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Total Amount:</h5>
                      <h4 className="mb-0 text-primary">
                        ${grandTotal.toFixed(2)}
                      </h4>
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleAdminClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={selectedRows.length === 0}
                      >
                        Confirm Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
