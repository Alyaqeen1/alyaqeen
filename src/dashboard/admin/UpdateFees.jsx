import React, { useState } from "react";
import {
  FaEye,
  FaPen,
  FaTrashAlt,
  FaUser,
  FaMoneyBill,
  FaCalendar,
} from "react-icons/fa";
import {
  useDeleteFeeMutation,
  useGetFeesByDateQuery,
} from "../../redux/features/fees/feesApi";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import FeeUpdateModal from "../shared/FeeUpdateModal";

export default function UpdateFees() {
  const { data: fees, isLoading, refetch } = useGetFeesByDateQuery();
  const [deleteFee] = useDeleteFeeMutation();
  const [showModal, setShowModal] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  const handleShow = (id) => {
    setSelectedFeeId(id);
    setShowModal(true);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-success";
      case "partial":
        return "text-warning";
      case "unpaid":
        return "text-danger";
      default:
        return "text-secondary";
    }
  };

  const formatCurrency = (amount) => {
    return `£${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };
  const handleDeleteFee = async (feeId) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteFee(feeId).unwrap();

            // Force refetch with cache busting
            setTimeout(() => {
              refetch();
            }, 100);

            Swal.fire({
              title: "Deleted!",
              text: "Fee has been deleted successfully.",
              icon: "success",
            });
          } catch (error) {
            Swal.fire({
              title: "Error",
              text: error?.data?.message || "Failed to delete fee.",
              icon: "error",
            });
          }
        }
      });
    } catch (error) {
      toast.error(`Failed to delete fee record: ${error?.message}`);
    }
  };
  const handleClose = () => setShowModal(false);
  return (
    <div>
      <h4 className="text-center mb-4">Fee Records</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="bg-light">
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
                Family
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
                Amount
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
                Payment
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Type
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
              fees.map((fee, idx) => {
                const latestPayment = fee.payments?.[fee.payments.length - 1];

                return (
                  <tr key={fee._id}>
                    {/* Serial Number */}
                    <td className="text-center fw-bold">{idx + 1}</td>

                    {/* Family Information */}
                    <td>
                      <div>
                        <div className="fw-semibold">{fee.name}</div>
                        <small className="text-muted">{fee.email}</small>
                      </div>
                    </td>

                    {/* Students */}
                    <td>
                      <div>
                        <FaUser className="me-1 text-muted" size={12} />
                        <span className="fw-semibold">
                          {fee.students?.length || 0}
                        </span>{" "}
                        students
                        {fee.students?.map((student, i) => (
                          <div key={i} className="small text-muted">
                            • {student.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Amount Information */}
                    <td className="text-center">
                      <div>
                        <div className="fw-semibold">
                          {formatCurrency(fee.expectedTotal)}
                        </div>
                        <small className="text-muted">
                          Remaining: {formatCurrency(fee.remaining)}
                        </small>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="text-center">
                      <span
                        className={`badge ${getStatusColor(
                          fee.status
                        )} bg-light`}
                      >
                        {fee.status?.toUpperCase()}
                      </span>
                    </td>

                    {/* Latest Payment */}
                    <td className="text-center">
                      {latestPayment ? (
                        <div>
                          <div className="fw-semibold">
                            {formatCurrency(latestPayment.amount)}
                          </div>
                          <small className="text-muted">
                            <FaCalendar className="me-1" size={10} />
                            {formatDate(latestPayment.date)}
                          </small>
                          <div className="small text-capitalize">
                            {latestPayment.method}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted">No payment</span>
                      )}
                    </td>

                    {/* Payment Type */}
                    <td className="text-center">
                      <span className="badge bg-secondary text-capitalize">
                        {fee.paymentType || "monthly"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-warning"
                          title="Edit Fee"
                          onClick={() => handleShow(fee?._id)}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete Fee"
                          onClick={() => handleDeleteFee(fee?._id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <div className="text-muted">
                    <FaMoneyBill size={32} className="mb-2" />
                    <div>No fee records found</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Simple Summary */}
      {fees?.length > 0 && (
        <div className="mt-3 p-3 bg-light rounded">
          <div className="row text-center">
            <div className="col">
              <strong>Total Records:</strong> {fees.length}
            </div>
            <div className="col">
              <strong>Paid:</strong>{" "}
              {fees.filter((f) => f.status === "paid").length}
            </div>
            <div className="col">
              <strong>Partial:</strong>{" "}
              {fees.filter((f) => f.status === "partial").length}
            </div>
            <div className="col">
              <strong>Unpaid:</strong>{" "}
              {fees.filter((f) => f.status === "unpaid").length}
            </div>
          </div>
        </div>
      )}
      {selectedFeeId && (
        <FeeUpdateModal
          key={`update-${selectedFeeId}`}
          feeId={selectedFeeId}
          showModal={showModal}
          handleClose={handleClose}
          refetch={refetch}
        />
      )}
    </div>
  );
}
