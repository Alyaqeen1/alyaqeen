import { useGetFeeQuery } from "../../redux/features/fees/feesApi";
export default function ShowFeeDataModal({ feeId, handleClose, showModal }) {
  const { data: fee } = useGetFeeQuery(feeId, {
    skip: !feeId, // avoid fetching if no ID
  });
  const handleBackdropClick = (event) => {
    // Close modal only if clicked on the backdrop (not modal content)
    if (event.target.classList.contains("modal")) {
      handleClose();
    }
  };

  if (!showModal) return null;

  return (
    <div>
      {/* Dark Background (Backdrop) */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{
          display: showModal ? "block" : "none",
          zIndex: 1050,
        }}
        onMouseDown={handleBackdropClick} // Detect click outside
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Payment Details- {fee?.name}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <table
                className="table table-bordered table-responsive"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#444", color: "#fff" }}>
                    <th>Student Name</th>
                    {fee?.paymentType === "monthly" ||
                    fee?.paymentType === "monthlyOnHold" ? (
                      <>
                        <th>Month Paid</th>
                        <th>Monthly Fee</th>
                        <th>Discounted Fee</th>
                        <th>Subtotal</th>
                      </>
                    ) : (
                      <>
                        <th>Joining Month</th>
                        <th>Monthly Fee</th>
                        <th>Discount</th>
                        <th>Admission Fee</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {fee?.students?.map((student, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "6px", border: "1px solid #ccc" }}>
                        {student?.name}
                      </td>

                      {/* For monthly payments */}
                      {fee?.paymentType === "monthly" ||
                      fee?.paymentType === "monthlyOnHold" ? (
                        <>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            {student?.monthsPaid?.map((data, i) => (
                              <span key={i}>
                                {data?.month}-{data?.year}
                                <br />
                              </span>
                            ))}
                          </td>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            {student?.monthsPaid?.map((data, i) => (
                              <span key={i}>
                                {data?.monthlyFee}
                                <br />
                              </span>
                            ))}
                          </td>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            {student?.monthsPaid?.map((data, i) => (
                              <span key={i}>
                                {data?.discountedFee}
                                <br />
                              </span>
                            ))}
                          </td>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            {student?.subtotal}
                          </td>
                        </>
                      ) : (
                        // For admission payments
                        <>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            {student?.joiningMonth} - {student?.joiningYear}
                          </td>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            {student?.monthlyFee}
                          </td>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            N/A
                          </td>
                          <td
                            style={{ padding: "6px", border: "1px solid #ccc" }}
                          >
                            Admission: {student?.admissionFee}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
