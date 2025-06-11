import React, { useState } from "react";
import { useGetStudentsQuery } from "../../redux/features/students/studentsApi";
import { useGetFamilyQuery } from "../../redux/features/families/familiesApi";

export default function AdminPayModal({
  familyId,
  handleAdminClose,
  adminShowModal,
  refetch: familiesRefetch,
}) {
  const {
    data: family,
    isLoading,
    refetch,
  } = useGetFamilyQuery(familyId, {
    skip: !familyId, // Prevent fetching until user is fully loaded
    refetchOnMountOrArgChange: true,
  });
  const { data: students, isLoading: studentLoading } = useGetStudentsQuery();
  const filteredStudents = students?.filter((student) =>
    family?.children?.includes(student.uid || student._id)
  ); // exclude already-added
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });

  const [selectedMonth, setSelectedMonth] = useState("June");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Month:", selectedMonth);
    // Submit logic here
    handleAdminClose();
  };

  return (
    <div>
      {adminShowModal && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${adminShowModal ? "show" : ""}`}
        tabIndex="-1"
        aria-hidden={!adminShowModal}
        style={{
          display: adminShowModal ? "block" : "none",
          zIndex: 1050,
        }}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) handleAdminClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Pay Fees</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleAdminClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              <div className="mb-3">
                <strong>Family:</strong> {family?.name}
              </div>
              <div className="mb-3">
                <strong>Students in Family:</strong>{" "}
                {filteredStudents?.map((std) => (
                  <span key={std._id}>{std?.name}, </span>
                ))}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3 col-4">
                    <label className="form-label">
                      <strong>Fee Year:</strong>
                    </label>
                    <select
                      className="form-select border-1 border-black"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3 col-4">
                    <label className="form-label">
                      <strong>Fee Month:</strong>
                    </label>
                    <select
                      className="form-select border-1 border-black"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3 col-4">
                    <label className="form-label">
                      <strong>Date:</strong>
                    </label>
                    <input
                      type="date"
                      className="form-control border-1 border-black"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-3 col-12">
                    <label className="form-label">
                      <strong>Pay Now:</strong>
                    </label>
                    <input
                      style={{ borderColor: "var(--border2)" }}
                      name="discount"
                      className="form-control"
                      type="number"
                    />
                  </div>

                  <div className="">
                    <button
                      type="submit"
                      style={{ backgroundColor: "var(--border2)" }}
                      className="btn text-white"
                    >
                      Pay Group Fee
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
