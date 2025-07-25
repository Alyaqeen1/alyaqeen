import React, { useState } from "react";
import { Link } from "react-router";
import PaymentModal from "../shared/PaymentModal";

export default function PaymentSummary() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const handleShow = (id) => {
    setSelectedPaymentId(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const monthData = [
    { _id: 1, name: "January", amount: 1000, paid: 500, due: 500 },
    { _id: 2, name: "February", amount: 1000, paid: 600, due: 400 },
    { _id: 3, name: "March", amount: 1000, paid: 800, due: 200 },
  ];

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
                Month
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Total Fee
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Paid
              </th>
              <th
                className="font-danger text-white fw-bolder border h6 text-center align-middle"
                style={{ backgroundColor: "var(--border2)" }}
              >
                Due
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {monthData?.length > 0 ? (
              monthData?.map((month, idx) => (
                <tr key={month?._id}>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className={` border h6 text-center align-middle text-nowrap`}
                  >
                    {month?.name}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {month?.amount}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {month?.paid}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {month?.due}
                  </td>
                  <td
                    className={`fw-medium border text-center align-middle text-nowrap`}
                  >
                    {month.paid === 0
                      ? "❌ Unpaid"
                      : month.paid < month.amount
                      ? "⏳ Partially Paid"
                      : "✅ Paid"}
                  </td>
                  <td
                    className={`border d-flex gap-2 justify-content-center h6 text-center align-middle text-nowrap`}
                  >
                    {month.paid < month.amount ? (
                      <button
                        className="text-white py-1 px-2 rounded-2"
                        style={{ backgroundColor: "var(--border2)" }}
                        onClick={() => handleShow(month?._id)}
                      >
                        Pay
                      </button>
                    ) : (
                      <button
                        disabled
                        className="text-white py-1 px-2 rounded-2 opacity-50 cursor-not-allowed"
                        style={{
                          backgroundColor: "var(--border2)",
                          cursor: "not-allowed",
                        }}
                      >
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12}>
                  <h5>No students available.</h5>
                </td>
              </tr>
            )}
            {}
          </tbody>
        </table>
        <PaymentModal
          PaymentId={selectedPaymentId}
          showModal={showModal}
          handleClose={handleClose}
        ></PaymentModal>
      </div>
    </div>
  );
}
