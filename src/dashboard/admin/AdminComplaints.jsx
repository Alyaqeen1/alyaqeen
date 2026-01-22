import React, { useState } from "react";
import { useGetComplaintsQuery } from "../../redux/features/complaint/complaintApi";
import {
  FaEye,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import LoadingSpinnerDash from "../components/LoadingSpinnerDash";
import Swal from "sweetalert2";

export default function AdminComplaints() {
  const { data: complaints, isLoading, refetch } = useGetComplaintsQuery();
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'new', 'pending', 'resolved'

  if (isLoading) {
    return <LoadingSpinnerDash />;
  }

  // Fix 1: Update the sorting logic to use createdAt
  const sortedComplaints = [...(complaints || [])].sort((a, b) => {
    // Use createdAt field for sorting, fallback to incident_date if not available
    const dateA = new Date(a.createdAt || a.incident_date || 0);
    const dateB = new Date(b.createdAt || b.incident_date || 0);

    if (sortBy === "newest") {
      return dateB - dateA; // Most recent first
    } else {
      return dateA - dateB; // Oldest first
    }
  });
  // Filter by status
  const filteredComplaints = sortedComplaints.filter((complaint) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "new")
      return !complaint.status || complaint.status === "new";
    return complaint.status === statusFilter;
  });

  // Fix 2: Update the handleViewDetails function to show createdAt properly
  const handleViewDetails = (complaint) => {
    Swal.fire({
      title: `<strong>${complaint.title}</strong>`,
      html: `
      <div class="text-start">
        <div class="mb-3">
          <h6>Complaint Details</h6>
          <p class="mb-2">${complaint.description}</p>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="card mb-2">
              <div class="card-body py-2">
                <small class="text-muted">Submitted By</small>
                <p class="mb-0"><strong>${complaint.name}</strong></p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card mb-2">
              <div class="card-body py-2">
                <small class="text-muted">Incident Date</small>
                <p class="mb-0"><strong>${new Date(complaint.incident_date).toLocaleDateString()}</strong></p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <div class="card mb-2">
              <div class="card-body py-2">
                <small class="text-muted">Email</small>
                <p class="mb-0"><strong>${complaint.email}</strong></p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card mb-2">
              <div class="card-body py-2">
                <small class="text-muted">Phone</small>
                <p class="mb-0"><strong>${complaint.phone || "Not provided"}</strong></p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-3">
          <small class="text-muted">Submitted On</small>
          <p class="mb-0"><strong>${new Date(complaint.createdAt).toLocaleString()}</strong></p>
        </div>
      </div>
    `,
      showCloseButton: true,
      showConfirmButton: false,
      width: "600px",
    });
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Complaints Management</h2>
        <div className="d-flex align-items-center justify-content-md-end">
          <span className="me-2">Sort by:</span>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${sortBy === "newest" ? "active text-white" : "btn-outline-secondary"}`}
              style={
                sortBy === "newest"
                  ? {
                      backgroundColor: "var(--border2)",
                      borderColor: "var(--border2)",
                    }
                  : {}
              }
              onClick={() => setSortBy("newest")}
            >
              <FaSortUp className="me-1" /> Newest First
            </button>
            <button
              type="button"
              className={`btn btn-sm ${sortBy === "oldest" ? "active text-white" : "btn-outline-secondary"}`}
              style={
                sortBy === "oldest"
                  ? {
                      backgroundColor: "var(--border2)",
                      borderColor: "var(--border2)",
                    }
                  : {}
              }
              onClick={() => setSortBy("oldest")}
            >
              <FaSortDown className="me-1" /> Oldest First
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">Complaints List</h5>
        </div>
        <div className="card-body">
          {filteredComplaints.length > 0 ? (
            <div className="row g-4">
              {filteredComplaints.map((complaint, index) => (
                <div key={complaint._id} className="col-12">
                  <div
                    className={`card border-0 shadow-sm ${!complaint.status || complaint.status === "new" ? "border-start border-3" : ""}`}
                    style={{
                      borderLeftColor:
                        !complaint.status || complaint.status === "new"
                          ? "var(--border2)"
                          : "transparent",
                    }}
                  >
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <div className="d-flex align-items-start mb-2">
                            <h5 className="card-title mb-0 me-2">
                              {complaint.title}
                            </h5>
                            {/* Show "New" badge only for the FIRST complaint in the filtered list */}
                            {/* Show "New" badge based on sort order */}
                            {(sortBy === "newest" && index === 0) ||
                            (sortBy === "oldest" &&
                              index === filteredComplaints.length - 1) ? (
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: "var(--border2)",
                                  color: "white",
                                }}
                              >
                                <FaExclamationTriangle className="me-1" /> New
                              </span>
                            ) : null}
                          </div>

                          <p className="card-text text-muted mb-3 line-clamp-2">
                            {complaint.description}
                          </p>

                          <div className="d-flex flex-wrap gap-3">
                            <div className="d-flex align-items-center text-muted">
                              <FaUser className="me-2" />
                              <small>{complaint.name}</small>
                            </div>
                            <div className="d-flex align-items-center text-muted">
                              <FaEnvelope className="me-2" />
                              <small>{complaint.email}</small>
                            </div>
                            {complaint.phone && (
                              <div className="d-flex align-items-center text-muted">
                                <FaPhone className="me-2" />
                                <small>{complaint.phone}</small>
                              </div>
                            )}
                            <div className="d-flex align-items-center text-muted">
                              <FaCalendarAlt className="me-2" />
                              <small>
                                {new Date(
                                  complaint.incident_date,
                                ).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                          <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewDetails(complaint)}
                            >
                              <FaEye className="me-1" /> View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <div className="rounded-circle bg-light d-inline-flex p-4 mb-3">
                  <FaExclamationTriangle className="fs-1 text-muted" />
                </div>
              </div>
              <h5 className="text-muted">No complaints found</h5>
              <p className="text-muted">
                {statusFilter === "all"
                  ? "There are no complaints yet."
                  : `No ${statusFilter} complaints found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
